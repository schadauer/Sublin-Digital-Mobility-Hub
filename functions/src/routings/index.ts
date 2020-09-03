import * as functions from 'firebase-functions';

// import { getPlace } from './get_place';
import { getProvider } from './get_provider';
import { getSteps } from './get_steps';
import { writeRoute } from './write_route';
// import { getAddressDetails, AddressDetails } from './get_address_details';
import { STATION } from '../types/delimiter';
import { getPartOfFormattedAddress } from '../utils/get_part_of_formatted_address';
import { isPubliclyAccessible } from './is_publicly_accessible';

// For test data --- Begin ---

// import { writeDummyData } from './write_dummy_data';
// if (process.env.FIRESTORE_EMULATOR_HOST === 'localhost:8080') {
//     (async (): Promise<void> => {
//         try {
//             await writeDummyData();
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
            if (data !== undefined && data['endId'] && data['startId'] && data['endAddress'] && data['startAddress']) {
                // Let's check if a provider is available for the end address
                //const addressGooglePlaceData: object = await getPlace(data['endId']);
                //const addressDetails: AddressDetails = getAddressDetails(addressGooglePlaceData)
                const isPubliclyAccessibleEndAddress: boolean = isPubliclyAccessible(data['endAddress']);
                const isPubliclyAccessibleStartAddress: boolean = isPubliclyAccessible(data['startAddress']);
                const providerForStartAddress: Array<object> = (isPubliclyAccessibleStartAddress === false) ? await getProvider(data['startAddress'], context.params.userId) : [];
                const providerForEndAddress: Array<object> = (isPubliclyAccessibleEndAddress === false) ? await getProvider(data['endAddress'], context.params.userId) : [];

                let sublinEndStep: Array<any> = [{}];
                let sublinStartStep: Array<any> = [{}];
                let stationForStartAddress: string = '';
                let stationForEndAddress: string = '';
                let publicSteps: Array<any> = [];
                let startTimeForStartAddress: number;
                let startTimeForEndAddress: number;


                // If a provider is available
                if (providerForEndAddress.length || providerForStartAddress.length) {

                    // Needs refactoring:
                    // if multiple providers are available with multiple stations
                    if (providerForStartAddress.length) {
                        stationForStartAddress = getPartOfFormattedAddress(providerForStartAddress[0]['stations'][0], STATION);
                    }
                    if (providerForEndAddress.length) {
                        stationForEndAddress = getPartOfFormattedAddress(providerForEndAddress[0]['stations'][0], STATION);

                    }

                    // If Sublin is only required for the the beginning of the trip
                    if (providerForStartAddress.length && !providerForEndAddress.length) {
                        console.log('Sublin Start Address only');
                        // Get route from startAddress to station
                        publicSteps = await getSteps(
                            stationForStartAddress,
                            data['endAddress'],
                            'transit',
                            null,
                            null,
                            providerForStartAddress[0],
                        );
                        // Add 10 Minutes to the pickup time 
                        startTimeForStartAddress = providerForStartAddress.length !== 0 ? publicSteps[0]['startTime'] : 0;
                        sublinStartStep = await getSteps(
                            data['startAddress'],
                            stationForStartAddress,
                            'driving',
                            startTimeForStartAddress,
                            startTimeForStartAddress,
                            providerForStartAddress[0],
                        );
                    }

                    // If Sublin is only required for the end of the trip
                    if (providerForEndAddress.length && !providerForStartAddress.length) {
                        console.log('Sublin End Address');
                        // Get route from startAddress to station
                        publicSteps = await getSteps(
                            data['startAddress'],
                            stationForEndAddress,
                            'transit',
                            null,
                            null,
                            providerForEndAddress[0],
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
                        );
                    }
                    if (providerForEndAddress.length && providerForStartAddress.length) {

                        console.log('Sublin Start Address and End Address');
                        // Get route from startAddress to station
                        publicSteps = await getSteps(
                            stationForStartAddress,
                            stationForEndAddress,
                            'transit',
                            null,
                            null,
                            providerForEndAddress[0],
                        );
                        // Add 10 minutes to the pickup time
                        startTimeForStartAddress = providerForStartAddress.length !== 0 ? publicSteps[0]['startTime'] : 0;
                        // Write it to /routings in the database
                        sublinStartStep = await getSteps(
                            data['startAddress'],
                            stationForStartAddress,
                            'driving',
                            startTimeForStartAddress,
                            startTimeForStartAddress,
                            providerForStartAddress[0],
                        );
                        startTimeForEndAddress = providerForEndAddress.length !== 0 ? publicSteps[publicSteps.length - 1]['endTime'] : 0;
                        sublinEndStep = await getSteps(
                            stationForEndAddress,
                            data['endAddress'],
                            'driving',
                            startTimeForEndAddress,
                            startTimeForEndAddress,
                            providerForEndAddress[0],
                        );
                    }
                    await writeRoute(
                        publicSteps,
                        sublinStartStep[0],
                        sublinEndStep[0],
                        context.params.userId,
                        data['startId'],
                        data['startAddress'],
                        stationForStartAddress,
                        data['endId'],
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
                        data['startId'],
                        data['startAddress'],
                        stationForStartAddress,
                        data['endId'],
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

