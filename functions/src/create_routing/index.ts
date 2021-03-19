import * as functions from 'firebase-functions';

import { getProvider } from './get_provider';
import { getSteps } from './get_steps';
import { writeRoute } from './write_route';
import { getUserName } from './get_user_name';
import { isPubliclyAccessible } from './is_publicly_accessible';
import { getStationFormattedAddress } from '../utils/get_station_formatted_address';

// For test data --- Begin ---

// import { writeDummyData } from './write_dummy_data';
// if (process.env.FIRESTORE_EMULATOR_HOST === 'localhost:8080') {
//     (async (): Promise<void> => {
//         try {
//             void writeDummyData();
//         } catch (e) {
//             console.log(e);
//         }
//     })();
// }

// For test data --- End ---

export const createRouting = functions
    .region('europe-west3')
    .firestore.document('/requests/{userId}')
    .onWrite(async (change, context) => {
        try {
            const data = change.after.data();
            // Let's get the full route
            if (data !== undefined && data['endAddress'] && data['startAddress']) {
                // Let's check if a provider is available for the end address
                //const addressGooglePlaceData: object = await getPlace(data['endId']);
                //const addressDetails: AddressDetails = getAddressDetails(addressGooglePlaceData)
                const isPubliclyAccessibleEndAddress: boolean = isPubliclyAccessible(data['endAddress']);
                const isPubliclyAccessibleStartAddress: boolean = isPubliclyAccessible(data['startAddress']);
                const providerForStartAddress: Array<object> = (isPubliclyAccessibleStartAddress === false) ? await getProvider(data['startAddress'], context.params.userId, false) : [];
                const providerForEndAddress: Array<object> = (isPubliclyAccessibleEndAddress === false) ? await getProvider(data['endAddress'], context.params.userId, data['checkAddress']) : [];
                let sublinEndStep: Array<any> = [{}];
                let sublinStartStep: Array<any> = [{}];
                let stationForStartAddress: string = '';
                let stationForEndAddress: string = '';
                let publicSteps: Array<any> = [];
                // let startTimeForStartAddress: number;
                let startTimeForEndAddress: number;
                // If a provider is available

                // Add 15 Minutes for the taxi and 10 minutes for getting to the platform
                const startTimeNow: number = Math.floor(Date.now() / 1000 + 60 * 25);

                if (providerForEndAddress.length || providerForStartAddress.length) {
                    // We need to get the user data 
                    const userName = await getUserName(context.params.userId);
                    // Needs refactoring:
                    // if multiple providers are available with multiple stations
                    if (providerForStartAddress.length) {
                        stationForStartAddress = getStationFormattedAddress(providerForStartAddress[0]['stations'][0]);
                    }
                    if (providerForEndAddress.length) {
                        stationForEndAddress = getStationFormattedAddress(providerForEndAddress[0]['stations'][0]);
                        // stationForEndAddress = providerForEndAddress[0]['stations'][0];
                    }

                    // If Sublin is at the beginning we need to calculate the driving time from the start address
                    // to the station
                    if (providerForStartAddress.length) {
                        sublinStartStep = await getSteps(
                            data['startAddress'],
                            stationForStartAddress,
                            'driving',
                            startTimeNow,
                            null,
                            providerForStartAddress[0],
                            userName,
                        );
                    }

                    // If Sublin is only required for the the beginning of the trip
                    if (providerForStartAddress.length && !providerForEndAddress.length) {
                        // Get route from startAddress to station
                        publicSteps = await getSteps(
                            stationForStartAddress,
                            data['endAddress'],
                            'transit',
                            startTimeNow + sublinStartStep[0]['duration'] + 60 * 10, // Adding 15 minutes to go to the plaform
                            null,
                            providerForStartAddress[0],
                            userName,
                        );
                        // Add 10 Minutes to the pickup time 
                        // startTimeForStartAddress = providerForStartAddress.length !== 0 ? publicSteps[0]['startTime'] : 0;
                        // sublinStartStep = await getSteps(
                        //     data['startAddress'],
                        //     stationForStartAddress,
                        //     'driving',
                        //     startTimeForStartAddress,
                        //     startTimeForStartAddress,
                        //     providerForStartAddress[0],
                        //     userName,
                        // );
                        sublinStartStep[0]['startTime'] = publicSteps[0]['startTime'] - sublinStartStep[0]['duration'] - 60 * 10;
                        sublinStartStep[0]['endTime'] = sublinStartStep[0]['startTime'] + sublinStartStep[0]['duration'];
                        console.log(sublinStartStep[0]['startTime']);
                        // console.log(sublinStartStep[0]['duration']);
                        // console.log(publicSteps[0]['startTime']);
                    }

                    // If Sublin is only required for the end of the trip
                    if (!providerForStartAddress.length && providerForEndAddress.length) {
                        // Get route from startAddress to station
                        publicSteps = await getSteps(
                            data['startAddress'],
                            stationForEndAddress,
                            'transit',
                            startTimeNow,
                            null,
                            providerForEndAddress[0],
                            userName,
                        );
                        startTimeForEndAddress = providerForEndAddress.length !== 0 ? publicSteps[publicSteps.length - 1]['endTime'] : 0;
                        // Write it to /routings in the database
                        sublinEndStep = await getSteps(
                            stationForEndAddress,
                            data['endAddress'],
                            'driving',
                            startTimeForEndAddress,
                            startTimeForEndAddress,
                            providerForEndAddress[0],
                            userName,
                        );
                    }
                    if (providerForStartAddress.length && providerForEndAddress.length) {
                        // Get route from startAddress to station
                        publicSteps = await getSteps(
                            stationForStartAddress,
                            stationForEndAddress,
                            'transit',
                            startTimeNow + sublinStartStep[0]['duration'],
                            null,
                            providerForEndAddress[0],
                            userName,
                        );
                        // Add 10 minutes to the pickup time
                        // startTimeForStartAddress = providerForStartAddress.length !== 0 ? publicSteps[0]['startTime'] : 0;
                        // Write it to /routings in the database
                        // sublinStartStep = await getSteps(
                        //     data['startAddress'],
                        //     stationForStartAddress,
                        //     'driving',
                        //     startTimeForStartAddress,
                        //     startTimeForStartAddress,
                        //     providerForStartAddress[0],
                        //     userName,
                        // );
                        sublinStartStep[0]['startTime'] = publicSteps[0]['startTime'] - sublinStartStep[0]['duration'] - 60 * 10;
                        sublinStartStep[0]['endTime'] = sublinStartStep[0]['startTime'] + sublinStartStep[0]['duration'];

                        startTimeForEndAddress = providerForEndAddress.length !== 0 ? publicSteps[publicSteps.length - 1]['endTime'] : 0;
                        sublinEndStep = await getSteps(
                            stationForEndAddress,
                            data['endAddress'],
                            'driving',
                            startTimeForEndAddress,
                            startTimeForEndAddress,
                            providerForEndAddress[0],
                            userName,
                        );
                    }

                    await writeRoute(
                        publicSteps,
                        sublinStartStep[0],
                        sublinEndStep[0],
                        context.params.userId,
                        'startId',
                        data['startAddress'],
                        stationForStartAddress,
                        'endId',
                        data['endAddress'],
                        stationForEndAddress,
                        data['checkAddress'],
                        isPubliclyAccessibleStartAddress,
                        isPubliclyAccessibleEndAddress,
                    );
                } else {
                    // If no provider is available we provide information about the location
                    // Information about the postcode and the city
                    await writeRoute(
                        [],
                        [],
                        [],
                        context.params.userId,
                        'startId',
                        data['startAddress'],
                        stationForStartAddress,
                        'endId',
                        data['endAddress'],
                        stationForEndAddress,
                        data['checkAddress'],
                        isPubliclyAccessibleStartAddress,
                        isPubliclyAccessibleEndAddress,
                    );
                }
                return null;
            } else {
                return null;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    });

