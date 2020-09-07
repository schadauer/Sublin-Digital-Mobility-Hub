import * as admin from 'firebase-admin';
import { getAddressesQueryArray } from '../utils/get_addresses_query_array';
import { getPartOfFormattedAddress } from '../utils/get_part_of_formatted_address';
import { CITY, STREET } from '../types/delimiter';
import { getProvidersFromJson } from '../utils/get_providers_from_json';
import { getProviderFromJson } from '../utils/get_provider_from_json';

export async function getProvider(formattedAddress: string, userId: string, checkAddress: boolean): Promise<Array<object>> {
    try {
        let shuttlesAndSponsors: Array<object>;
        let selectedProvider: object | null = null;
        let selectedProviders: Array<object> = [];
        const userEmail = await _getUserEmaiAddresses(userId);


        if (checkAddress !== undefined && checkAddress !== null && checkAddress === true) {
            shuttlesAndSponsors = await _getTaxis(formattedAddress);
            if (shuttlesAndSponsors.length !== 0)
                selectedProviders = shuttlesAndSponsors;
        } else {
            const shuttles = await _getShuttles(formattedAddress);
            const sponsors = await _getSponsors(formattedAddress);
            shuttlesAndSponsors = [...shuttles, ...sponsors];

            // We need to remove those providers that have a target group set (emailOnly)
            shuttlesAndSponsors = await _filterTargetGroupByEmails(shuttlesAndSponsors, userEmail);

            // Now we check which address is the closest starting with the house number
            shuttlesAndSponsors.forEach(async (provider) => {
                // Start with the street and number
                provider['addresses'].forEach((address: string) => {
                    const providerStreet = getPartOfFormattedAddress(address, STREET);
                    // const providerNumber = getPartOfFormattedAddress(address, NUMBER);
                    const requestedStreet = getPartOfFormattedAddress(formattedAddress, STREET);
                    // const requestedNumber = getPartOfFormattedAddress(formattedAddress, NUMBER);

                    if (providerStreet === requestedStreet)
                        selectedProvider = provider;
                });
            })

            // If we do not find an address that matches we try the city
            if (selectedProvider === null) {
                shuttlesAndSponsors.forEach(async (provider) => {
                    // Start with the street and number
                    provider['addresses'].forEach((address: string) => {
                        const providerCity = getPartOfFormattedAddress(address, CITY);
                        const requestedCity = getPartOfFormattedAddress(formattedAddress, CITY);
                        if (providerCity === requestedCity)
                            selectedProvider = provider;
                    });
                })
            }
            // Now we need to get the taxi provider for the sponsors
            if (selectedProvider !== null && selectedProvider['providerType'] === 'sponsor') {
                const sponsor = selectedProvider;
                selectedProvider = await _getTaxiAsPartner(selectedProvider['partners'][0]);
                if (selectedProvider !== null)
                    selectedProvider['sponsor'] = sponsor;
            }
            if (selectedProvider !== null)
                selectedProviders = [selectedProvider];
            else
                selectedProviders = [];
        }

        return selectedProviders;
    } catch (e) {
        console.log(e);
        return [];
    }
}

async function _filterTargetGroupByEmails(shuttlesAndSponsors: Array<object>, userEmail: string): Promise<Array<object>> {
    let shuttlesAndSponsorsFiltered = [];
    for (let index = 0; index < shuttlesAndSponsors.length; index++) {
        if (shuttlesAndSponsors[index]['providerPlan'] !== null && shuttlesAndSponsors[index]['providerPlan'] === 'emailOnly') {
            const providerTargetGroupFromUser = await _getProviderTargetGroupFromUser(shuttlesAndSponsors[index]['id']);
            if (providerTargetGroupFromUser !== undefined && providerTargetGroupFromUser !== null) {
                if (providerTargetGroupFromUser.includes(userEmail)) {
                    shuttlesAndSponsorsFiltered.push(shuttlesAndSponsors[index]);
                }
            }
        } else if (shuttlesAndSponsors[index]['providerPlan'] !== null
            && shuttlesAndSponsors[index]['providerPlan'] === 'all')
            shuttlesAndSponsorsFiltered.push(shuttlesAndSponsors[index]);
    }
    console.log(shuttlesAndSponsorsFiltered);
    return shuttlesAndSponsorsFiltered;
}

async function _getTaxiAsPartner(partnerId: string): Promise<any> {
    try {
        const doc = await admin.firestore().collection('providers').doc(partnerId).get();
        return getProviderFromJson(doc);
    } catch (e) {
        console.log(e)
        return {};
    }
}

async function _getShuttles(formattedAddress: string): Promise<Array<object>> {
    try {
        const querySnapshot = await admin.firestore().collection('providers')
            .where('addresses', "array-contains-any", getAddressesQueryArray(formattedAddress))
            .where('providerType', '==', 'shuttle')
            .get();
        return getProvidersFromJson(querySnapshot);
    } catch (e) {
        console.log(e);
        return [];
    }
}

async function _getTaxis(formattedAddress: string): Promise<Array<object>> {
    try {
        const querySnapshot = await admin.firestore().collection('providers')
            .where('addresses', "array-contains-any", getAddressesQueryArray(formattedAddress))
            .where('providerType', '==', 'taxi')
            .get();
        return getProvidersFromJson(querySnapshot);
    } catch (e) {
        console.log(e);
        return [];
    }
}

async function _getSponsors(formattedAddress: string): Promise<Array<object>> {
    try {
        const querySnapshot = await admin.firestore().collection('providers')
            .where('addresses', "array-contains-any", getAddressesQueryArray(formattedAddress))
            .where('providerType', '==', ['sponsor', 'sponsorShuttle'])
            .get();
        return getProvidersFromJson(querySnapshot);
    } catch (e) {
        console.log(e);
        return [];
    }
}

async function _getProviderTargetGroupFromUser(providerId: string): Promise<Array<any>> {
    let targetGroup: Array<any> = [];
    const doc = await admin.firestore().collection('users').doc(providerId)
        .get();
    const data: any = doc.data() ?? null;
    if (data !== null && data['targetGroup'] !== undefined && data['targetGroup'] !== null) {
        targetGroup = data['targetGroup'];
    }
    return targetGroup;
}

async function _getUserEmaiAddresses(userId: string): Promise<string> {
    let email: string = '';
    const doc = await admin.firestore().collection('users').doc(userId)
        .get();
    const data: any = doc.data();
    if (doc.exists && data['email']) {
        email = data['email']
    }
    return email;
}