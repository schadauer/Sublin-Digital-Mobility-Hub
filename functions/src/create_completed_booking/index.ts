import * as functions from 'firebase-functions';
import { writeCompletedBooking } from './write_completed_bookings';

export const createCompletedBooking = functions
    .region('europe-west3')
    .firestore.document('/bookings/{providerId}/confirmed/{userId}')
    .onUpdate(async (change, context) => {
        try {
            const after = change.after.data();
            if (after !== undefined) {
                let sublinStartStep;
                let sublinEndStep;
                if (after.sublinEndStep !== undefined
                    && after.sublinEndStep !== null
                    && after.sublinEndStep.completed !== undefined
                    && after.sublinEndStep.completed === true) {
                    sublinEndStep = after.sublinEndStep;
                    sublinEndStep.completedTime = Date.now();
                }
                if (after.sublinStartStep !== undefined
                    && after.sublinStartStep !== null
                    && after.sublinStartStep.completed !== undefined
                    && after.sublinStartStep.completed === true) {
                    sublinStartStep = after.sublinStartStep;
                    sublinStartStep.completedTime = Date.now();
                }
                await writeCompletedBooking(sublinStartStep, sublinEndStep, after, context.params.providerId, context.params.userId, after.bookingId);
            }
        } catch (e) {
            console.log(e);
        }
    }
    )