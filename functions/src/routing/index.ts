import * as functions from 'firebase-functions';

import { getPlace } from './get_place';
import { getProvider } from './get_provider';
import { getSteps } from './get_steps';
import { writeRoute } from './write_route';
import { getAddressDetails, AddressDetails } from './get_address_details';

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
            if (data !== undefined && data['endId'] && data['startId']) {
                // Let's check if a provider is available for postcode
                const addressGooglePlaceData: object = await getPlace(data['endId']);
                //const addressComponents: Array<object> = addressGooglePlaceData['address_components'];
                const addressDetails: AddressDetails = getAddressDetails(addressGooglePlaceData)
                const provider: Array<object> = await getProvider(addressDetails.postcode);


                // If a provider is available
                if (provider.length) {
                    // Needs refactoring:
                    // if multiple providers are available with multiple stations
                    const station: string = provider[0]['stations'][0].substring(5, provider[0]['stations'][0].length);
                    // Get route from startAddress to station
                    const publicSteps: Array<any> = await getSteps(data['startId'], station, 'transit', context.params.userId);
                    // Get route from station to endAddress
                    const startTime: number = publicSteps[publicSteps.length - 1]['endTime'] || 0;
                    // Write it to /routings in the database
                    const sublinEndStep: Array<any> = await getSteps(station, data['endId'], 'driving', provider[0]['id'], startTime);
                    // Get route from station to endAddress
                    await writeRoute(publicSteps, sublinEndStep[0], context.params.userId, provider[0], [], data['startId'], data['endId']);
                } else {
                    // If no provider is available we provide information about the location
                    // Information about the postcode and the city
                    await writeRoute([], [], context.params.userId, {}, addressDetails, data['startId'], data['endId']);
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

