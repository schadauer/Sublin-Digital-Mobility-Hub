import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export async function writeRoute(publicSteps: Array<any>, sublinStartStep: object, sublinEndStep: object, user: string, startId: string, startAddress: string, endId: string, endAddress: string, checkAddress: boolean = false, isPubliclyAccessibleStartAddress: boolean, isPubliclyAccessibleEndAddress: boolean): Promise<void> {
    try {
        if (Object.keys(sublinStartStep).length || Object.keys(sublinEndStep).length) {
            await admin.firestore().collection(checkAddress ? 'check' : 'routings').doc(user).set({
                booked: false,
                publicSteps: publicSteps || null,
                sublinEndStep: sublinEndStep || {},
                sublinStartStep: sublinStartStep || {},
                user,
                group: 'passenger',
                startAddress,
                startId,
                endId,
                endAddress,
                endAddressAvailable: Object.keys(sublinEndStep).length !== 0,
                startAddressAvailable: Object.keys(sublinStartStep).length !== 0,
                isPubliclyAccessibleEndAddress,
                isPubliclyAccessibleStartAddress,
                id: uuidv4(),
            });
        } else {
            await admin.firestore().collection(checkAddress ? 'check' : 'routings').doc(user).set({
                user,
                // endAddress: addressComponents,
                endAddressAvailable: false,
                startId,
                startAddress,
                endId,
                endAddress,
                id: uuidv4(),
            });
        }
    } catch (e) {
        console.log(e)
    }
}