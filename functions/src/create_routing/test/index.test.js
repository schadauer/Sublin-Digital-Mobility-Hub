
var test = (test, delimiter, data) => {
    const { firestore } = require('firebase-admin');
    const assert = require('chai').assert;

    describe('Cloud Functions', () => {
        let myFunctions;
        before(() => {
            myFunctions = require('../../../lib/index.js');
            const sponsor = 'sponsor';
            const taxi = 'taxi';

            eval(data.setUserSeitenstetten);
            eval(data.setUserSponsorShuttleAllSeitenstetten);
            eval(data.setUserTaxiSeitenstetten);
            eval(data.setUserSponsorAllSeitenstetten);
            eval(data.setProviderSponsorAllSeitenstetten);
            eval(data.setProviderTaxiSeitenstetten);
        });

        after(() => {
            // firestore().collection('/routings').doc('testuser').delete();
            test.done;
            test.cleanup();
        });
        describe('createRoute', async () => {
            it('should find and write a route to the routing collection', async () => {
                const wrapped = test.wrap(myFunctions.createRouting);
                await firestore().collection('requests').doc('testuser').set({
                    startId: 'ChIJRQJUCdapbUcRIwZCXrOBLow',
                    startAddress: '__COU__AT__CIT__Wien__STR__Viktorgasse__NUM__12',
                    endId: 'ChIJL2dh39E0ckcRJrcj74AXr_k',
                    endAddress: '__COU__AT__CIT__Peter-Lisec-Straße, Seitenstetten__COM__LISEC Austria GmbH',
                    checkAddress: false,
                });
                const beforeSnap = await firestore().collection('requests').doc('testuser').get();
                await firestore().collection('requests').doc('testuser').set({
                    startId: 'ChIJRQJUCdapbUcRIwZCXrOBLow',
                    startAddress: '__COU__AT__CIT__Wien__STR__Viktorgasse__NUM__24',
                    endId: 'ChIJL2dh39E0ckcRJrcj74AXr_k',
                    endAddress: '__COU__AT__CIT__Seitenstetten__COM__LISEC Austria GmbH',
                    checkAddress: false,
                });
                const afterSnap = await firestore().collection('requests').doc('testuser').get();
                const dataRequests = test.makeChange(beforeSnap, afterSnap);
                return await wrapped(dataRequests, {
                    params: {
                        userId: 'testuser'
                    }
                }).then(async () => {
                    return firestore().collection('routings').doc('testuser').get().then((doc) => {
                        return assert.equal(doc.data()['userId'], 'testuser');
                    });
                });
            });
        });
    });
};

exports.test = test;
