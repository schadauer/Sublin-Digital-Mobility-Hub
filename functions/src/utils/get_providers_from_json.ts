import { getProviderFromJson } from "./get_provider_from_json";

export function getProvidersFromJson(querySnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>): Array<object> {
    const activeProviders = new Array();
    querySnapshot.forEach((doc: FirebaseFirestore.DocumentData) => {
        let data = doc.data();
        // if (doc.exists && data['stations']) {
        if (doc.exists) {
            // We expect an array of stations with the format XXXX_Name-of-station - XXXX stands for postcode.
            // if (_checkIfStationServed(data['stations'], getPartOfFormattedAddress(formattedAddress, CITY))
            if (data['inOperation'] === true
                // && data['isTaxi'] === true
            ) {
                activeProviders.push(getProviderFromJson(doc));
            }
        }
    });
    return activeProviders;
}

