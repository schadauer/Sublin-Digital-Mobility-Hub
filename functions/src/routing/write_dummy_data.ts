import * as admin from 'firebase-admin';

export async function writeDummyData(): Promise<void> {
    try {
        const user = 'testuser';
        const provider = 'testprovider';
        const isFilledWithDummyData = await admin.firestore().collection('providers').doc(provider).get().then((data) => {
            return data.data();
        });
        if (!isFilledWithDummyData) {
            await admin.firestore().collection('requests').doc(user).set({
                startId: 'ChIJ3_D0_NWpbUcRDQF6DKB8gnc',
                //Weg 8, Krenstetten
                endId: 'ChIJfwNwxKg1ckcRKRtFoViJtwc'
                //Waidhofner Straße 
                //endId: 'Ei5XYWlkaG9mbmVyIFN0cmHDn2UsIFNlaXRlbnN0ZXR0ZW4sIMOWc3RlcnJlaWNoIi4qLAoUChIJZzVT8bA0ckcRreMBlPLjIpcSFAoSCeeHyrW2NHJHEVniceSP_30G',
            });
            await admin.firestore().collection('providers').doc(provider).set({
                addresses: ['Lisec'],
                bases: ['3353'],
                city: ['Seitenstetten'],
                inOperation: true,
                name: 'Taxi Raab',
                outOfWork: false,
                phone: '069000 00000',
                postcode: ['3353'],
                stations: ['3353_Bahnhof St.Peter Seitenstetten'],
                timeEnd: 2200,
                timeStart: 600
            });
        }
    } catch (e) {
        console.log(e);
    }
}