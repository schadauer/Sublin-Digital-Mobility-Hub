import * as admin from 'firebase-admin';


export async function getProvider(postcode: String): Promise<Array<object>> {
    try {
        const activeProviders = new Array();
        const querySnapshot = await admin.firestore().collection('providers')
            .where('postcode', "array-contains", postcode)
            .get();
        querySnapshot.forEach((doc: any) => {
            const data = doc.data();
            if (doc.exists && data['stations']) {
                // We expect an array of stations with the format XXXX_Name-of-station - XXXX stands for postcode.
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
        return [];
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