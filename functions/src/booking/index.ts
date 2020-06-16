import * as functions from 'firebase-functions';
import { writeBooking } from './write_booking';

export const createBooking = functions
    .region('europe-west3')
    .firestore.document('/routings/{userId}')
    .onUpdate(async (change, context) => {
        try {
            const after = change.after.data();
            if (after !== undefined && after.booked !== undefined && after.booked === true) {
                if (after.sublinEndStep !== undefined && after.provider !== undefined && after.provider.id !== undefined) {
                    await writeBooking(after.sublinEndStep, after.provider.id, after.id);
                }

            }
        } catch (e) {
            console.log(e);
        }
    }
    )