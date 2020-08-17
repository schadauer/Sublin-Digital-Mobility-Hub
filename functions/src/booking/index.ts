import * as functions from 'firebase-functions';
import { writeBooking } from './write_booking';

export const createBooking = functions
    .region('europe-west3')
    .firestore.document('/routings/{userId}')
    .onUpdate(async (change, context) => {
        try {
            const after = change.after.data();
            if (after !== undefined && after.booked !== undefined && after.booked === true) {
                const timeNow: number = Date.now();
                if (after.sublinEndStep !== undefined && after.sublinEndStep !== null && after.sublinEndStep.provider !== undefined && after.sublinEndStep.provider.id !== undefined) {
                    const sublinEndStep = after.sublinEndStep;
                    sublinEndStep.bookedTime = timeNow;
                    await writeBooking(null, after.sublinEndStep, null, after.sublinEndStep.provider.id, after.id);
                }
                if (after.sublinStartStep !== undefined && after.sublinStartStep !== null && after.sublinStartStep.provider !== undefined && after.sublinStartStep.provider.id !== undefined) {
                    const sublinStartStep = after.sublinStartStep;
                    sublinStartStep.bookedTime = timeNow;
                    await writeBooking(after.sublinStartStep, null, after.sublinStartStep.provider.id, null, after.id);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
    )