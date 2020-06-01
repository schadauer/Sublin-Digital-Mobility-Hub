import * as admin from 'firebase-admin';
let activeProviders = new Array();
const date = new Date();
const timeNow = parseInt(String(date.getHours()) + String(date.getMinutes()));
console.log(timeNow);

export async function getProvider(postcode: String): Promise<any> {
    try {
        const querySnapshot = await admin.firestore().collection('providers')
            .where('postcode', "array-contains", postcode)
            .get();
        querySnapshot.forEach((doc: any) => {
            let data = doc.data();
            if (doc.exists) {
                if (data['timeStart'] < timeNow
                    && data['timeEnd'] > timeNow
                    && data['inOperation'] === true) {
                    console.log(doc.data()['timeStart']);
                    let provider = {
                        id: doc.id,
                        data: doc.data()
                    };
                    activeProviders.push(provider);
                }


            }
        });
        console.log(activeProviders);
    } catch (e) {
        console.log(e);
        return null;
    }
}