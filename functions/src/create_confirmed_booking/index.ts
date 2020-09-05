import * as functions from 'firebase-functions';
import { writeConfirmedBooking } from './write_confirmed_booking';

export const createConfirmBooking = functions
    .region('europe-west3')
    .firestore.document('/bookings/{providerId}/open/{userId}')
    .onUpdate(async (change, context) => {
        try {
            const after = change.after.data();
            if (after !== undefined) {
                let sublinStartStep;
                let sublinEndStep;
                if (after.sublinEndStep !== undefined
                    && after.sublinEndStep !== null
                    && after.sublinEndStep.confirmed !== undefined
                    && after.sublinEndStep.confirmed === true) {
                    sublinEndStep = after.sublinEndStep;
                    sublinEndStep.confirmedTime = Date.now();
                }
                if (after.sublinStartStep !== undefined
                    && after.sublinStartStep !== null
                    && after.sublinStartStep.confirmed !== undefined
                    && after.sublinStartStep.confirmed === true) {
                    sublinStartStep = after.sublinStartStep;
                    sublinStartStep.confirmedTime = Date.now();
                }
                await writeConfirmedBooking(sublinStartStep, sublinEndStep, context.params.providerId, context.params.userId, after.bookingId);
            }
        } catch (e) {
            console.log(e);
        }
    }
    )