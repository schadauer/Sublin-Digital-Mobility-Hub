import * as admin from 'firebase-admin';

export async function writeConfirmedBooking(sublinEndStep: Map<any, any>, providerId: string, id: string): Promise<Array<any>> {
    try {
        await admin.firestore().collection('booking').doc(providerId).collection('confirmed').doc(id).set({
            sublinEndStep,
        });
        await admin.firestore().collection('booking').doc(providerId).collection('open').doc(id).delete();
        return [];
    } catch (e) {
        console.log(e)
        return [];
    }
}