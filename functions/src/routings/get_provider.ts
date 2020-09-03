import * as admin from 'firebase-admin';
import { getAddressesQueryArray } from '../utils/get_addresses_query_array';
import { getPartOfFormattedAddress } from '../utils/get_part_of_formatted_address';
import { CITY, STREET } from '../types/delimiter';
import { getProvidersFromJson } from '../utils/get_providers_from_json';
import { getProviderFromJson } from '../utils/get_provider_from_json';

export async function getProvider(formattedAddress: string, userId: string): Promise<Array<object>> {
    const userEmail = await _getUserEmaiAddresses(userId);
    const shuttles = await _getShuttles(formattedAddress);
    const sponsors = await _getSponsors(formattedAddress);
    let shuttlesAndSponsors = [...shuttles, ...sponsors];
    let selectedProvider: object | null = null;

    // We need to remove those providers that have a target group set (emailOnly)
    shuttlesAndSponsors = shuttlesAndSponsors.filter((provider) => {
        if (provider['providerPlan'] !== null
            && provider['providerPlan'] === 'emailOnly'
            && provider['targetGroup'] !== null
        ) {
            return provider['targetGroup'].includes(userEmail);
        } else if (provider['providerPlan'] !== null
            && provider['providerPlan'] === 'all')
            return true;
        else
            return false;
    })

    // Now we check which address is the closest starting with the house number
    shuttlesAndSponsors.forEach((provider) => {
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
        shuttlesAndSponsors.forEach((provider) => {
            // Start with the street and number
            provider['addresses'].forEach((address: string) => {
                const providerCity = getPartOfFormattedAddress(address, CITY);
                const requestedCity = getPartOfFormattedAddress(formattedAddress, CITY);
                if (providerCity === requestedCity)
                    selectedProvider = provider;
            });
        })
    }
    // No we need to get the taxi provider for the sponsors
    if (selectedProvider !== null && selectedProvider['providerType'] === 'sponsor') {
        const sponsor = selectedProvider;
        selectedProvider = await _getTaxiAsPartner(selectedProvider['partners'][0]);
        if (selectedProvider !== null)
            selectedProvider['sponsor'] = sponsor;

    }
    if (selectedProvider !== null)
        return [selectedProvider];
    else
        return [];
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

// function _getProvidersFromJson(querySnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>): Array<object> {
//     const activeProviders = new Array();
//     querySnapshot.forEach((doc: FirebaseFirestore.DocumentData) => {
//         let data = doc.data();
//         // if (doc.exists && data['stations']) {
//         if (doc.exists) {
//             // We expect an array of stations with the format XXXX_Name-of-station - XXXX stands for postcode.
//             // if (_checkIfStationServed(data['stations'], getPartOfFormattedAddress(formattedAddress, CITY))
//             if (data['inOperation'] === true
//                 // && data['isTaxi'] === true
//             ) {
//                 activeProviders.push(_getProviderfromJson(doc));
//             }
//         }
//     });
//     return activeProviders;
// }

// function _getProviderfromJson(doc: FirebaseFirestore.DocumentData): object {
//     const data = doc.data();
//     const provider = {
//         id: doc.id,
//         providerName: data['providerName'],
//         timeStart: data['timeStart'],
//         timeEnd: data['timeEnd'],
//         stations: data['stations'],
//         addresses: data['addresses'],
//         providerType: data['providerType'],
//         providerPlan: data['providerPlan'],
//         targetGroup: data['targetGroup'],
//         partners: data['partners']
//     };
//     return provider;

// }

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