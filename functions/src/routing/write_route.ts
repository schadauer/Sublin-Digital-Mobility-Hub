import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export async function writeRoute(publicSteps: Array<any>, sublinEndStep: object, user: string, provider: object, addressComponents: object, startId: string, endId: string): Promise<void> {
    try {
        if (Object.keys(provider).length) {
            await admin.firestore().collection('routings').doc(user).set({
                booked: false,
                confirmed: false,
                publicSteps: publicSteps || null,
                sublinEndStep: sublinEndStep || null,
                sublinStartStep: null,
                user,
                provider: provider || null,
                group: 'passenger',
                id: uuidv4(),
                startId,
                endId,
            });
        } else if (!Object.keys(provider).length) {
            await admin.firestore().collection('routings').doc(user).set({
                user,
                unavailableAddress: addressComponents,
                provider: null,
                startId,
                endId,
            });
        }
    } catch (e) {
        console.log(e)

    }
}