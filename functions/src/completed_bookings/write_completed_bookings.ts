import * as admin from 'firebase-admin';

export async function writeCompletedBooking(sublinEndStep: Map<any, any>, providerId: string, userId: string): Promise<Array<any>> {
    try {
        await admin.firestore().collection('confirmedBookings').doc(providerId).collection('confirmed').doc(userId).set({
            sublinEndStep,
        });
        await admin.firestore().collection('bookings').doc(providerId).collection('open').doc(userId).delete();
        await admin.firestore().collection('routings').doc(userId).update({
            sublinEndStep,
        })
        return [];
    } catch (e) {
        console.log(e)
        return [];
    }
}