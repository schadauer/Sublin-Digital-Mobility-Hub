import * as functions from 'firebase-functions';
import { updateProviderWithConfirmation } from './confirmed_partnership';

export const confirmedPartnership = functions
    .region('europe-west3')
    .firestore.document('/providers/{userId}')
    .onUpdate(async (change, context) => {
        try {
            const after = change.after.data();
            const before = change.before.data();
            if (after !== undefined
                && after !== null
                && before !== undefined
                && before != null
                && after['partners'] !== null
                && before['partners'] !== null
                && after['partners'].length !== before['partners'].length
                && after['providerType'] === 'taxi') {
                if (after['partners'].length > before['partners'].length) {
                    const afterPartners: Array<string> = after['partners'];
                    const newPartners = afterPartners.filter(partner => {
                        return before['partners'].includes(partner) === false;
                    });
                    for (let i = 0; i < newPartners.length; i++) {
                        await updateProviderWithConfirmation(true, newPartners[i]);
                    }
                }
                if (after['partners'].length < before['partners'].length) {
                    const beforePartners: Array<string> = before['partners'];
                    const oldPartners = beforePartners.filter(partner => {
                        return after['partners'].includes(partner) === false;
                    });
                    for (let i = 0; i < oldPartners.length; i++) {
                        await updateProviderWithConfirmation(false, oldPartners[i]);
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
    )