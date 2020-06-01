import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { getPlace } from './routing/get_place';
import { getProvider } from './routing/get_provider';
import { getSteps } from './routing/get_route';

admin.initializeApp();

export const createRouting = functions.firestore.document('/requests/{userId}')
    .onWrite(async (change, context) => {
        try {
            const data = change.after.data();
            // Let's get the full route
            if (data !== undefined && data['endId'] && data['startId']) {


                console.log(await getSteps(data['startId'], data['endId'], 'transit'));

                // Let's check if a provider is available for this
                // a) postcode
                // b) time

                const address = await getPlace(data['endId']);
                const postcode = address['address_components'].find((el: any) => {
                    if (el['types'][0] === 'postal_code') {
                        return true;
                    }
                    return false;
                })
                // const provider = await getProvider(postcode['long_name']);


                return null;
            } else {
                return null;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    });