import * as admin from 'firebase-admin';

export async function updateUser(isProviderCompleted: boolean, user: string): Promise<void> {
    try {
        await admin.firestore().collection('users').doc(user).update({ isProviderCompleted: true });
        await admin.firestore().collection('providers').doc(user).update({ inOperation: true });
    } catch (e) {
        console.log(e)
    }
}