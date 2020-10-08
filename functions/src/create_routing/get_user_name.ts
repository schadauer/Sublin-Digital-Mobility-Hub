import * as admin from 'firebase-admin';

export async function getUserName(userId: string): Promise<string> {
    const user: any = await admin.firestore().collection('users').doc(userId).get();
    if (user.exists && user.data() !== undefined && user.data() !== null)
        return user.data()['firstName'];
    else
        return '';
}