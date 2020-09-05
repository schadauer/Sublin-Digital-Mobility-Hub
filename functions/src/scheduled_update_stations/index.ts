import * as admin from 'firebase-admin';
import * as data from './data';
import { v4 as uuidv4 } from 'uuid';

export async function updateStations(): Promise<void> {
    try {
        data.stations.forEach((station) => {
            const commaRemoved = station.replace(',', '').toLowerCase();
            const terms: Array<string> = commaRemoved.split(new RegExp(/\s|\-/g));
            let splitTerms: Array<string> = [];
            terms.forEach((term) => {
                if (term !== 'Bahnhof') {
                    if (term.length >= 2) {
                        for (let i = 2; i < term.length + 1; i++) {
                            splitTerms.push(term.substring(0, i))
                        }
                    } else {
                        splitTerms.push(term);
                    }
                }
            })
            void admin.firestore().collection('stations').doc(uuidv4()).set({ name: station, terms: splitTerms });
        })

    } catch (e) {
        console.log(e)
    }
}