import * as functions from 'firebase-functions';
import { writeCompletedBooking } from './write_completed_bookings';

export const createCompletedBooking = functions
    .region('europe-west3')
    .firestore.document('/confirmedBookings/{providerId}/confirmed/{userId}')
    .onUpdate(async (change, context) => {
        try {
            const after = change.after.data();
            if (after !== undefined) {
                if (after.sublinEndStep !== undefined && after.sublinEndStep !== null && after.sublinEndStep.confirmed !== undefined && after.sublinEndStep.confirmed === true) {
                    const sublinEndStep = after.sublinEndStep;
                    sublinEndStep.confirmedTime = Date.now();
                    await writeCompletedBooking(sublinEndStep, context.params.providerId, context.params.userId);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
    )