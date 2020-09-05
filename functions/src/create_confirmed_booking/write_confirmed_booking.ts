import * as admin from 'firebase-admin';

export async function writeConfirmedBooking(sublinStartStep: Map<any, any> | {}, sublinEndStep: Map<any, any> | {}, providerId: string, userId: string, bookingId: string): Promise<Array<any>> {
    try {
        if (sublinEndStep) {
            await admin.firestore().collection('bookings').doc(providerId).collection('confirmed').doc(userId).set({
                sublinEndStep,
                userId,
                bookingId,
            });
            await admin.firestore().collection('routings').doc(userId).set({
                sublinEndStep,
            }, { merge: true })
        }
        if (sublinStartStep) {
            await admin.firestore().collection('bookings').doc(providerId).collection('confirmed').doc(userId).set({
                sublinStartStep,
                userId,
                bookingId,
            });
            await admin.firestore().collection('routings').doc(userId).set({
                sublinStartStep,
            }, { merge: true })
        }
        if (sublinEndStep || sublinStartStep)
            await admin.firestore().collection('bookings').doc(providerId).collection('open').doc(userId).delete();
        return [];
    } catch (e) {
        console.log(e)
        return [];
    }
}