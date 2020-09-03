import * as functions from 'firebase-functions';
import { updateUserProfile } from './update_user_profile';

export const updateUserProfileFunction = functions
    .region('europe-west3')
    .firestore.document('/users/{userId}')
    .onUpdate(async (change, context) => {
        try {
            const after = change.after.data();
            if (after !== undefined) {
                if (after.homeAddress !== undefined
                    && after.homeAddress !== null
                    && after.homeAddress !== ''
                    && after.email !== undefined
                    && after.email !== null
                    && after.email !== ''
                ) {
                    await updateUserProfile(after.homeAddress, context.params.userId, after.email);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
    )