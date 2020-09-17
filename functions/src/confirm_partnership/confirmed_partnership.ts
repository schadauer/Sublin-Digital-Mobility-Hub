import * as admin from 'firebase-admin';

export async function updateProviderWithConfirmation(partnershipConfirmed: boolean, user: string): Promise<void> {
    try {
        await admin.firestore().collection('providers').doc(user).update({ partnershipConfirmed: partnershipConfirmed });
    } catch (e) {
        console.log(e)
    }
}