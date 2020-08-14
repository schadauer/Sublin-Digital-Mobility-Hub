import * as functions from 'firebase-functions';
import { writeConfirmedBooking } from './write_confirmed_booking';

export const createConfirmBooking = functions
    .region('europe-west3')
    .firestore.document('/booking/{userId}/open/{docId}')
    .onUpdate(async (change, context) => {
        try {
            const after = change.after.data();
            if (after !== undefined) {
                if (after.sublinEndStep !== undefined && after.sublinEndStep !== null && after.sublinEndStep.confirmed !== undefined && after.sublinEndStep.confirmed === true) {
                    const sublinEndStep = after.sublinEndStep;
                    sublinEndStep.confirmedTime = Date.now();
                    await writeConfirmedBooking(sublinEndStep, sublinEndStep.provider.id, context.params.docId);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
    )