import * as admin from 'firebase-admin';

export async function writeCompletedBooking(sublinStartStep: Map<any, any> | {}, sublinEndStep: Map<any, any> | {}, data: FirebaseFirestore.DocumentData, providerId: string, userId: string, bookingId: string): Promise<Array<any>> {
    try {
        if (sublinEndStep) {
            await admin.firestore().collection('bookings').doc(providerId).collection('completed').doc(bookingId).set({
                sublinEndStep,
                userId,
            });
            if (sublinEndStep['sponsor'] !== undefined && sublinEndStep['sponsor'] != null && sublinEndStep['sponsor']['id'] != null) {
                await admin.firestore().collection('bookings').doc(sublinEndStep['sponsor']['id']).collection('completed').doc(bookingId).set({
                    sublinEndStep,
                    userId,
                });
            }
            await admin.firestore().collection('routings').doc(userId).set({
                sublinEndStep,
            }, { merge: true });
        }

        if (sublinStartStep) {
            await admin.firestore().collection('bookings').doc(providerId).collection('completed').doc(bookingId).set({
                sublinStartStep,
                userId,
            });
            if (sublinStartStep['sponsor'] !== undefined && sublinStartStep['sponsor'] != null && sublinStartStep['sponsor']['id'] != null) {
                await admin.firestore().collection('bookings').doc(sublinStartStep['sponsor']['id']).collection('completed').doc(bookingId).set({
                    sublinStartStep,
                    userId,
                });
            }
            await admin.firestore().collection('routings').doc(userId).set({
                sublinStartStep,
            }, { merge: true });
        }

        if (sublinEndStep || sublinStartStep) {
            await admin.firestore().collection('bookings').doc(providerId).collection('confirmed').doc(userId).delete();
            await admin.firestore().collection('users').doc(userId).collection('archive').doc(bookingId).set({
                ...data
            });
        }
        return [];
    } catch (e) {
        console.log(e)
        return [];
    }
}