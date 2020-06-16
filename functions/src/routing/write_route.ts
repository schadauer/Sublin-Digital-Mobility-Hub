import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export async function writeRoute(publicSteps: Array<any>, sublinEndStep: Array<any>, user: string, provider: Map<any, any>): Promise<Array<any>> {
    try {
        // publicSteps.push(sublinEndStep[0]);
        await admin.firestore().collection('routings').doc(user).set({
            booked: false,
            confirmed: false,
            publicSteps: publicSteps,
            sublinEndStep: sublinEndStep[0],
            sublinStartStep: null,
            user,
            provider,
            group: 'passenger',
            id: uuidv4()
        });
        return [];
    } catch (e) {
        console.log(e)
        return [];
    }
}