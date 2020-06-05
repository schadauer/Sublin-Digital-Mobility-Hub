import * as admin from 'firebase-admin';
const activeProviders = new Array();

export async function getProvider(postcode: String): Promise<any> {
    try {
        const querySnapshot = await admin.firestore().collection('providers')
            .where('postcode', "array-contains", postcode)
            .get();
        querySnapshot.forEach((doc: any) => {
            const data = doc.data();
            if (doc.exists && data['stations']) {
                if (_checkIfStationServed(data['stations'], postcode)
                    && data['inOperation'] === true) {
                    const provider = {
                        id: doc.id,
                        name: data['name'],
                        timeStart: data['timeStart'],
                        timeEnd: data['timeEnd'],
                        stations: data['stations']
                    };
                    activeProviders.push(provider);
                }
            }
        });
        return activeProviders;
    } catch (e) {
        console.log(e);
        return null;
    }
}

function _checkIfStationServed(stations: Array<String>, postcode: any): boolean {
    let stationServed = false;
    stations.forEach((station: String) => {
        if (station.indexOf(postcode) >= 0) {
            stationServed = true;
        }
    })
    return stationServed;
}