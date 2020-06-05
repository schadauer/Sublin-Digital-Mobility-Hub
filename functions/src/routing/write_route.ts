import * as admin from 'firebase-admin';

export async function writeRoute(publicRoute: Array<any>, sublinRoute: Array<any>, user: string, provider: string): Promise<Array<any>> {
    try {
        publicRoute.push(sublinRoute[0]);
        await admin.firestore().collection('routings').doc(user).set({
            route: publicRoute,
            user,
            provider
        });
        return [];
    } catch (e) {
        console.log(e)
        return [];
    }
}