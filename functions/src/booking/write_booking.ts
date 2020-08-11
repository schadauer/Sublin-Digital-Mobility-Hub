import * as admin from 'firebase-admin';

export async function writeBooking(sublinEndStep: Map<any, any>, providerId: string, id: string): Promise<Array<any>> {
    try {
        console.log('writing');
        await admin.firestore().collection('booking').doc(providerId).collection('open').doc(id).set({
            sublinEndStep,
            // id
        });
        return [];
    } catch (e) {
        console.log(e)
        return [];
    }
}