import * as admin from 'firebase-admin';

export async function writeRoute(publicRoute: Array<any>, sublinRoute: Array<any>, user: string, provider: string): Promise<Array<any>> {
    try {
        const publicObjKey = provider;
        let publicObj: any = {};
        publicObj[publicObjKey] = publicRoute;
        const sublinObjKey = user;
        let sublinObj: any = {};
        sublinObj[sublinObjKey] = sublinRoute;
        console.log(sublinObj);
        console.log(publicObj);

        //await admin.firestore().collection('routings').doc(user).set(publicObj);
        //await admin.firestore().collection('routings').doc(user).set(sublinObj);

        return [];
    } catch (e) {
        console.log(e)
        return [];
    }
}