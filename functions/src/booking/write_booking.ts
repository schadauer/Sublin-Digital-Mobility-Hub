import * as admin from 'firebase-admin';
// import { provider } from 'firebase-functions/lib/providers/analytics';

export async function writeBooking(sublinStartStep: Map<any, any> | null, sublinEndStep: Map<any, any> | null, startStepProviderId: string | null, endStepProviderId: string | null, id: string): Promise<Array<any>> {
    try {
        if (sublinStartStep !== null && startStepProviderId !== null)
            await admin.firestore().collection('booking').doc(startStepProviderId).collection('open').doc(id).set({
                sublinStartStep,
                id
            });
        if (sublinEndStep != null && endStepProviderId !== null)
            await admin.firestore().collection('booking').doc(endStepProviderId).collection('open').doc(id).set({
                sublinEndStep,
                id
            });
        return [];
    } catch (e) {
        console.log(e)
        return [];
    }
}