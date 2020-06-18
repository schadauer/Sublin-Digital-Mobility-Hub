import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export async function writeRoute(publicSteps: Array<any>, sublinEndStep: object, user: string, provider: object, addressComponents: Array<any>): Promise<void> {
    try {
        if (Object.keys(provider).length) {
            await admin.firestore().collection('routings').doc(user).set({
                booked: false,
                confirmed: false,
                publicSteps: publicSteps || [],
                sublinEndStep: sublinEndStep || {},
                sublinStartStep: {},
                user,
                provider: provider || {},
                group: 'passenger',
                id: uuidv4()
            });
        } else if (!Object.keys(provider).length && addressComponents.length) {
            await admin.firestore().collection('routings').doc(user).set({
                unavailableAddress: addressComponents
            });
        }
    } catch (e) {
        console.log(e)

    }
}