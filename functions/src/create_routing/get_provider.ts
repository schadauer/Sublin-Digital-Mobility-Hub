import * as admin from 'firebase-admin';
const crypto = require("crypto");
import { getAddressesQueryArray } from '../utils/get_addresses_query_array';
import { getPartOfFormattedAddress } from '../utils/get_part_of_formatted_address';
import { CITY, COMPANY, STREET } from '../types/delimiter';
import { getProvidersFromJson } from '../utils/get_providers_from_json';
import { getProviderFromJson } from '../utils/get_provider_from_json';
import { StepStatus } from '../types/step_status'

export async function getProvider(formattedAddress: string, userId: string, checkAddress: boolean): Promise<Array<object>> {
    try {
        let shuttlesAndSponsors: Array<object>;
        let selectedProvider: object | null = null;
        let selectedProviders: Array<object> | StepStatus = [];
        const userEmail = await _getUserEmaiAddresses(userId);
        let stepStatus: StepStatus = StepStatus.notAvailable;

        // CHECK - ONLY -This is only for address check-up and not to create a route
        if (checkAddress !== undefined && checkAddress !== null && checkAddress === true) {
            shuttlesAndSponsors = await _getTaxis(formattedAddress);
            if (shuttlesAndSponsors.length !== 0)
                selectedProviders = shuttlesAndSponsors;
        } else {
            // We start our search with the shuttles
            const shuttles = await _getShuttles(formattedAddress);
            shuttlesAndSponsors = await _filterTargetGroupByEmails(shuttles, userEmail);
            if (shuttles.length !== 0 && shuttlesAndSponsors.length === 0)
                stepStatus = StepStatus.notInTargetGroup

            // If we do not find a shuttle for our request we go on with the shuttle sponsors
            // for a particular address
            if (shuttlesAndSponsors.length === 0) {
                const sponsorShuttle = await _getSponsorShuttle(formattedAddress);
                shuttlesAndSponsors = await _filterTargetGroupByEmails(sponsorShuttle, userEmail);
                if (sponsorShuttle.length !== 0 && shuttlesAndSponsors.length === 0)
                    stepStatus = StepStatus.notInTargetGroup
            }
            // Still no provider found? Let's continue our journey with the sponsors
            // for a city
            if (shuttlesAndSponsors.length === 0 && stepStatus as StepStatus !== StepStatus.notInTargetGroup) {
                const sponsors = await _getSponsors(formattedAddress);
                stepStatus = StepStatus.notInTargetGroup;
                shuttlesAndSponsors = await _filterTargetGroupByEmails(sponsors, userEmail);
            }
            // First we check which address is the closest starting with the company name
            shuttlesAndSponsors.forEach(async (provider) => {
                // Start with the street and number
                provider['addresses'].forEach((address: string) => {
                    const providerStreet = getPartOfFormattedAddress(address, COMPANY);
                    // const providerNumber = getPartOfFormattedAddress(address, NUMBER);
                    const requestedStreet = getPartOfFormattedAddress(formattedAddress, COMPANY);
                    // const requestedNumber = getPartOfFormattedAddress(formattedAddress, NUMBER);
                    if (providerStreet === requestedStreet)
                        selectedProvider = provider;
                });
            })

            // Now we check which address is the second closest with the street number
            if (selectedProvider === null) {
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
            }

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
            // and we need to check if the taxi has approved of the relationship in target group
            if (selectedProvider !== null && selectedProvider['providerType'] === 'sponsor' || selectedProvider !== null && selectedProvider['providerType'] === 'sponsorShuttle') {
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

async function _filterTargetGroupByEmails(resultList: Array<object>, userEmail: string): Promise<Array<object>> {
    let resultListFiltered = [];
    for (let index = 0; index < resultList.length; index++) {
        if (resultList[index]['providerPlan'] !== undefined && resultList[index]['providerPlan'] !== null && resultList[index]['providerPlan'] === 'emailOnly') {
            if (resultList[index]['targetGroup'] !== undefined && resultList[index]['targetGroup'] !== null) {
                if (resultList[index]['targetGroup'].includes(crypto.createHash('sha256').update(userEmail).digest('hex'))) {
                    resultListFiltered.push(resultList[index]);

                }
            }
        } else if (resultList[index]['providerPlan'] !== null
            && resultList[index]['providerPlan'] === 'all')
            resultListFiltered.push(resultList[index]);
    }

    return resultListFiltered = resultListFiltered;
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

async function _getSponsorShuttle(formattedAddress: string): Promise<Array<object>> {
    try {
        const querySnapshot = await admin.firestore().collection('providers')
            .where('addresses', "array-contains-any", getAddressesQueryArray(formattedAddress))
            .where('providerType', '==', 'sponsorShuttle')
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
            .where('providerType', '==', 'sponsor')
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