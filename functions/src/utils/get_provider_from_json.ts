export function getProviderFromJson(doc: FirebaseFirestore.DocumentData): object {
    const data = doc.data();
    const provider = {
        id: doc.id,
        providerName: data['providerName'],
        timeStart: data['timeStart'],
        timeEnd: data['timeEnd'],
        stations: data['stations'],
        addresses: data['addresses'],
        providerType: data['providerType'],
        providerPlan: data['providerPlan'],
        targetGroup: data['targetGroup'],
        partners: data['partners']
    };
    return provider;
}