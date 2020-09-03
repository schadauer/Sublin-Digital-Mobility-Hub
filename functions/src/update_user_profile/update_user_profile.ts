import * as admin from 'firebase-admin';
import { getAddressesQueryArray } from '../utils/get_addresses_query_array';
import { getProvidersFromJson } from '../utils/get_providers_from_json';

export async function updateUserProfile(homeAddress: string, userId: string, email: string): Promise<void> {
    try {
        const querySnapshotAddress = await admin.firestore().collection('providers')
            .where('addresses', 'array-contains-any', getAddressesQueryArray(homeAddress))
            .where('providerPlan', '==', 'all')
            // .where('providerType', 'in', ['shuttle', 'sponsor'])
            .get();
        // We need to filter out taxi as we cannot add it to the query
        let routesAddressResult = getProvidersFromJson(querySnapshotAddress);
        routesAddressResult = routesAddressResult.filter((provider) => {
            if (provider['providerType'] !== null && provider['providerType'] === 'taxi')
                return false;
            else return true;

        })
        const querySnapshotEmail = await admin.firestore().collection('providers')
            .where('targetGroup', 'array-contains', email)
            .where('providerPlan', '==', 'emailOnly')
            .where('providerType', 'in', ['shuttle', 'sponsor'])
            .get();

        await admin.firestore().collection('users').doc(userId).set({
            routesAddress: routesAddressResult,
            routesEmail: getProvidersFromJson(querySnapshotEmail),
        }, { merge: true });
    } catch (e) {
        console.log(e)
    }
}