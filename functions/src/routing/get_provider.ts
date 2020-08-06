import * as admin from 'firebase-admin';
// import { getPartOfFormattedAddress } from '../utils/get_part_of_formatted_address';
import { getAddressesQueryArray } from '../utils/get_addresses_query_array';
import { ProviderPlan } from '../types/provider_plan';
// import { COMPANY, NUMBER, STREET, CITY, COUNTRY, STATION } from '../types/delimiter';

export async function getProvider(formattedAddress: string, userId: string): Promise<Array<object>> {
    const activeProviders = await _getProviders(formattedAddress);
    const email = await _getUserEmaiAddresses(userId);
    const selectedProviders = activeProviders.filter((provider) => {
        if (provider['providerPlan'] === ProviderPlan.emailOnly) {
            return (provider['targetGroup'].indexOf(email) > -1);
        } else {
            return true
        }
    });
    return selectedProviders;
}

async function _getProviders(formattedAddress: string): Promise<Array<object>> {
    try {
        const activeProviders = new Array();
        const querySnapshot = await admin.firestore().collection('providers')
            .where('addresses', "array-contains-any", getAddressesQueryArray(formattedAddress))
            .get();
        querySnapshot.forEach((doc: any) => {
            const data = doc.data();
            if (doc.exists && data['stations']) {
                // We expect an array of stations with the format XXXX_Name-of-station - XXXX stands for postcode.
                // if (_checkIfStationServed(data['stations'], getPartOfFormattedAddress(formattedAddress, CITY))
                if (data['inOperation'] === true
                    // && data['isTaxi'] === true
                ) {
                    const provider = {
                        id: doc.id,
                        providerName: data['providerName'],
                        timeStart: data['timeStart'],
                        timeEnd: data['timeEnd'],
                        stations: data['stations'],
                        addresses: data['addresses'],
                        providerType: data['providerType'],
                        providerPlan: data['providerPlan'],
                        targetGroup: data['targetGroup'],
                    };
                    activeProviders.push(provider);
                }
            }
        });
        return activeProviders;
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