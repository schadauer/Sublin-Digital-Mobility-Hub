import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export async function writeRoute(publicSteps: Array<any>, sublinEndStep: object, user: string, provider: object, addressComponents: object, startId: string, endId: string, checkAddress: boolean = false): Promise<void> {
    try {
        if (Object.keys(provider).length) {
            await admin.firestore().collection(checkAddress ? 'check' : 'routings').doc(user).set({
                booked: false,
                confirmed: false,
                publicSteps: publicSteps || null,
                sublinEndStep: sublinEndStep || null,
                endAddress: addressComponents,
                endAddressAvailable: true,
                sublinStartStep: null,
                user,
                provider: provider || null,
                group: 'passenger',
                startId,
                endId,
                id: uuidv4(),
            });

        } else if (!Object.keys(provider).length) {
            await admin.firestore().collection(checkAddress ? 'check' : 'routings').doc(user).set({
                user,
                endAddress: addressComponents,
                endAddressAvailable: false,
                provider: null,
                startId,
                endId,
                id: uuidv4(),
            });

        }
    } catch (e) {
        console.log(e)

    }
}