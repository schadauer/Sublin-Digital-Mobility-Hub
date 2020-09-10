import * as functions from 'firebase-functions';
import { updateUser } from './update_user';

export const setProviderToCompleted = functions
    .region('europe-west3')
    .firestore.document('/providers/{userId}')
    .onUpdate(async (change, context) => {
        try {
            const data = change.after.data();
            if (data !== undefined && data['isRegistrationCompleted'] === true) {
                await updateUser(true, context.params.userId);
            }
        } catch (e) {
            console.log(e);
        }
    }
    )