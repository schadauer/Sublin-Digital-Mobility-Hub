import * as functions from 'firebase-functions';

import { getPlace } from './get_place';
import { getProvider } from './get_provider';
import { getSteps } from './get_steps';
import { writeRoute } from './write_route';
import { writeDummyData } from './write_dummy_data';


(async () => {
    if (process.env.FIRESTORE_EMULATOR_HOST === 'localhost:8080') {
        await writeDummyData();
    }
})();

export const createRouting = functions.firestore.document('/requests/{userId}')
    .onWrite(async (change, context) => {
        try {

            const data = change.after.data();
            // Let's get the full route
            if (data !== undefined && data['endId'] && data['startId']) {
                // Let's check if a provider is available for postcode
                const address = await getPlace(data['endId']);
                const postcode = address['address_components'].find((el: any) => {
                    return (el['types'][0] === 'postal_code') ? true : false
                })
                const provider = await getProvider(postcode['long_name']);

                if (provider.length) {
                    // Needs refactoring:
                    // if multiple providers are available with multiple stations
                    const station: String = provider[0]['stations'][0].substring(5, provider[0]['stations'][0].length);
                    // Get route from startAddress to station
                    const publicRoute = await getSteps(data['startId'], station, 'transit', context.params.userId);
                    // Get route from station to endAddress
                    const sublinRoute = await getSteps(station, data['endId'], 'driving', provider[0].id);
                    // Get route from station to endAddress
                    await writeRoute(publicRoute, sublinRoute, context.params.userId, provider[0].id);
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

