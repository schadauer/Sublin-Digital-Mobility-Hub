import * as admin from 'firebase-admin';
import { COMPANY, NUMBER, STREET, CITY, COUNTRY, STATION } from '../types/delimiter';

export async function writeDummyData(): Promise<void> {
    try {
        const user = 'testuser';
        const provider = 'testuser';
        const isFilledWithDummyData = await admin.firestore().collection('providers').doc(provider).get().then((data) => {
            return data.data();
        });
        if (!isFilledWithDummyData) {
            await admin.firestore().collection('requests').doc(user).set({
                startId: 'ChIJU4afF34HbUcRgajbsxo8mw8',
                startAddress: '__COU__AT__CIT__Wien__STR__Viktorgasse__NUM__8',
                endId: 'ChIJfwNwChIJk52Sx7A0ckcR1syxXIdjlUUxKg1ckcRKRtFoViJtwc',
                endAddress: '__COU__AT__CIT__Seitenstetten__STR__Waidhofner Straße__NUM__6',
                //endId: 'Ei5XYWlkaG9mbmVyIFN0cmHDn2UsIFNlaXRlbnN0ZXR0ZW4sIMOWc3RlcnJlaWNoIi4qLAoUChIJZzVT8bA0ckcRreMBlPLjIpcSFAoSCeeHyrW2NHJHEVniceSP_30G',
            });
            await admin.firestore().collection('providers').doc('testuser').set({
                addresses: [COUNTRY + 'AT' + CITY + 'Seitenstetten' + STREET + 'Peter-Lisec-Straße'],
                city: ['Seitenstetten'],
                inOperation: true,
                providerName: 'Lisec',
                providerPlan: 'emailOnly',
                providerType: 'taxiShuttle',
                targetGroup: ['wolfgang@schadauer.at'],
                partners: ['testuser2'],
                outOfWork: false,
                stations: [COMPANY + 'LISEC Austria GmbH' + STREET + 'Peter-Lisec-Straße' + CITY + 'Seitenstetten' + COUNTRY + 'AT'],
                timeEnd: 2200,
                timeStart: 600
            });
            await admin.firestore().collection('providers').doc('testuser2').set({
                addresses: [COUNTRY + 'AT' + CITY + 'Seitenstetten' + STREET + 'Waidhofner Straße' + NUMBER + '6', COUNTRY + 'AT' + CITY + 'Seitenstetten'],
                city: ['Seitenstetten'],
                inOperation: true,
                providerName: 'Taxi Raab',
                providerPlan: '',
                providerType: 'taxi',
                targetGroup: ['wolfgang@schadauer.at'],
                partners: ['qzoG5ypFBufBBqa0b5BW9eEw0Rl1'],
                outOfWork: false,
                stations: [COUNTRY + 'AT' + CITY + 'Seitenstetten' + STATION + 'Bahnhof St.Peter Seitenstetten'],
                timeEnd: 2200,
                timeStart: 600
            });
            await admin.firestore().collection('users').doc('testuser').set({
                email: 'andreas@simpledesign.io',
                firstName: 'Andreas',
                homeAddress: 'Viktorgasse',
                isProfileComplete: false,
                isProvider: true,
                requestedAddresses: [],
                secondNmae: '',
            })
        }
    } catch (e) {
        console.log(e);
    }
}