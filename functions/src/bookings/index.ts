import * as functions from 'firebase-functions';
import { writeBooking } from './write_bookings';

export const createBooking = functions
    .region('europe-west3')
    .firestore.document('/routings/{userId}')
    .onUpdate(async (change, context) => {
        try {
            const after = change.after.data();
            if (after !== undefined && after.booked !== undefined && after.booked === true) {
                const timeNow: number = Date.now();
                if (after.sublinEndStep !== undefined
                    && after.sublinEndStep !== null
                    && after.sublinEndStep.provider !== undefined
                    && after.sublinEndStep.provider.id !== undefined
                    && after.sublinEndStep.confirmed !== undefined
                    && after.sublinEndStep.confirmed === false) {
                    const sublinEndStep = after.sublinEndStep;
                    sublinEndStep.bookedTime = timeNow;
                    await writeBooking(null, after.sublinEndStep, null, after.sublinEndStep.provider.id, after.id, context.params.userId);
                }
                if (after.sublinStartStep !== undefined
                    && after.sublinStartStep !== null
                    && after.sublinStartStep.provider !== undefined
                    && after.sublinStartStep.provider.id !== undefined
                    && after.sublinStartStep.confirmed !== undefined
                    && after.sublinStartStep.confirmed === false) {
                    const sublinStartStep = after.sublinStartStep;
                    sublinStartStep.bookedTime = timeNow;
                    await writeBooking(after.sublinStartStep, null, after.sublinStartStep.provider.id, null, after.id, context.params.userId);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
    )