import * as admin from 'firebase-admin';
// import { provider } from 'firebase-functions/lib/providers/analytics';

export async function writeBooking(sublinStartStep: Map<any, any> | null, sublinEndStep: Map<any, any> | null, startStepProviderId: string | null, endStepProviderId: string | null, bookingId: string, userId: string): Promise<Array<any>> {
    try {
        console.log(sublinEndStep);
        if (sublinStartStep !== null && startStepProviderId !== null)
            await admin.firestore().collection('bookings').doc(startStepProviderId).collection('open').doc(userId).set({
                sublinStartStep,
                bookingId,
                userId,
            });
        if (sublinEndStep !== null && endStepProviderId !== null)
            await admin.firestore().collection('bookings').doc(endStepProviderId).collection('open').doc(userId).set({
                sublinEndStep,
                bookingId,
                userId,
            });
        return [];
    } catch (e) {
        console.log(e)
        return [];
    }
}