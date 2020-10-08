const { expect } = require('chai');

var test = (test, delimiter, data) => {
    const { firestore } = require('firebase-admin');
    const assert = require('chai').assert;
    const beforeRequest = {
        // startId: 'ChIJRQJUCdapbUcRIwZCXrOBLow',
        startAddress: '__COU__AT__CIT__Wien__STR__Viktorgasse__NUM__12',
        // endId: 'ChIJL2dh39E0ckcRJrcj74AXr_k',
        endAddress: '__COU__AT__CIT__Seitenstetten__STR__Peter-Lisec-Straße__COM__LISEC Austria GmbH',
        checkAddress: false,
    };
    const defaultCityAddress = '__COU__AT__CIT__Wien__STR__Meidlinger Hauptstraße__NUM__10';
    const lisecAddressSponsorShuttle = '__COU__AT__CIT__Seitenstetten__STR__Peter-Lisec-Straße__COM__LISEC Austria GmbH';
    const stiftAddressShuttle = '__COU__AT__CIT__Seitenstetten__STR__Am Klosterberg__COM__Stift Seitenstetten';


    describe('Cloud Functions', () => {
        let myFunctions;
        before(() => {
            myFunctions = require('../../../lib/index.js');
            const sponsor = 'sponsor';
            const taxi = 'taxi';
            eval(data.setUserSeitenstetten);
            eval(data.setUserBiberbach);
            eval(data.setUserLisecAllSeitenstetten);
            eval(data.setUserTaxiSeitenstetten);
            eval(data.setUserSponsorAllSeitenstetten);
            eval(data.setUserStiftSeitenstettenSeitenstetten);
            eval(data.setUserDasGoldBergHofgasteein);
            eval(data.setProviderGemeindeSeitenstetten);
            eval(data.setProviderTaxiSeitenstetten);
            eval(data.setProviderLisecEmailOnlySeitenstetten);
            eval(data.setProviderStiftSeitenstetten);
            eval(data.setProviderDasGoldbergHofgastein);
        });

        after(() => {
            // firestore().collection('/routings').doc('testuser').delete();
            test.done;
            test.cleanup();
        });
        // We Test User Seitenstetten - to Lisec - emailOnly - sponsorShuttle
        describe('createRoute', async () => {
            it('should find a route for User Seitenstten because he is set as target group', async () => {
                const wrapped = test.wrap(myFunctions.createRouting);
                await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').set(beforeRequest);
                const beforeSnap = await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').get();
                await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').set({
                    checkAddress: false,
                    startAddress: '__COU__AT__CIT__Seitenstetten__STR__Steyrer Straße',
                    endAddress: defaultCityAddress,
                });
                const afterSnap = await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').get();
                const dataRequests = test.makeChange(beforeSnap, afterSnap);
                return await wrapped(dataRequests, {
                    params: {
                        userId: 'YOxqioCO5LTSEWXqnN2Gnm6obvH3'
                    }
                }).then(async () => {
                    return firestore().collection('routings').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').get().then((doc) => {
                        return assert.equal(doc.data()['status'], 'active');
                    });
                });
            });
        });
        describe('createRoute', async () => {
            it('should NOT a route to Lisec for User Biberbach because User is not part of the target group', async () => {
                const wrapped = test.wrap(myFunctions.createRouting);
                await firestore().collection('requests').doc('2MGuqfYn6NVx555UpsJ08EqFqJN2').set(beforeRequest);
                const beforeSnap = await firestore().collection('requests').doc('2MGuqfYn6NVx555UpsJ08EqFqJN2').get();
                await firestore().collection('requests').doc('2MGuqfYn6NVx555UpsJ08EqFqJN2').set({
                    checkAddress: false,
                    startAddress: defaultCityAddress,
                    endAddress: lisecAddressSponsorShuttle,
                });
                const afterSnap = await firestore().collection('requests').doc('2MGuqfYn6NVx555UpsJ08EqFqJN2').get();
                const dataRequests = test.makeChange(beforeSnap, afterSnap);
                return await wrapped(dataRequests, {
                    params: {
                        userId: '2MGuqfYn6NVx555UpsJ08EqFqJN2'
                    }
                }).then(async () => {
                    return firestore().collection('routings').doc('2MGuqfYn6NVx555UpsJ08EqFqJN2').get().then((doc) => {
                        return assert.equal(doc.data()['status'], 'unavailable');
                    });
                });
            });
        });

        // We Test User Seitenstetten - to Stift Seitenstettten - all - Shuttle
        describe('createRoute', async () => {
            it('should find a route for User Seitenstten to Stift Seitenstetten because no target group is set', async () => {
                const wrapped = test.wrap(myFunctions.createRouting);
                await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').set(beforeRequest);
                const beforeSnap = await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').get();
                await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').set({
                    checkAddress: false,
                    startAddress: defaultCityAddress,
                    endAddress: stiftAddressShuttle,
                });
                const afterSnap = await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').get();
                const dataRequests = test.makeChange(beforeSnap, afterSnap);
                return await wrapped(dataRequests, {
                    params: {
                        userId: 'YOxqioCO5LTSEWXqnN2Gnm6obvH3'
                    }
                }).then(async () => {
                    return firestore().collection('routings').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').get().then((doc) => {
                        return assert.equal(doc.data()['status'], 'active');
                    });
                });
            });
        });
        describe('createRoute', async () => {
            it('should NOT find a route to Lisec for User Seitenstetten because because Taxi has not approved of the partnership yet', async () => {
                const wrapped = test.wrap(myFunctions.createRouting);
                await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').set(beforeRequest);
                const beforeSnap = await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').get();
                await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').set({
                    checkAddress: false,
                    startAddress: defaultCityAddress,
                    endAddress: lisecAddressSponsorShuttle,
                });
                const afterSnap = await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').get();
                const dataRequests = test.makeChange(beforeSnap, afterSnap);
                return await wrapped(dataRequests, {
                    params: {
                        userId: 'YOxqioCO5LTSEWXqnN2Gnm6obvH3'
                    }
                }).then(async () => {
                    return firestore().collection('routings').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').get().then((doc) => {
                        return assert.equal(doc.data()['status'], 'unavailable');
                    });
                });
            });
        });
        // We Test User Seitenstetten - Gemeinde Seitenstetten - all - Sponsor
        describe('createRoute', async () => {
            it('should find a route to Waidhofner Straße for User Seitenstten because no target group is needed for private addresses', async () => {
                const wrapped = test.wrap(myFunctions.createRouting);
                await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').set(beforeRequest);
                const beforeSnap = await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').get();
                await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').set({
                    checkAddress: false,
                    startAddress: defaultCityAddress,
                    endAddress: '__COU__AT__CIT__Seitenstetten__STR__Waidhofner',
                });
                const afterSnap = await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').get();
                const dataRequests = test.makeChange(beforeSnap, afterSnap);
                return await wrapped(dataRequests, {
                    params: {
                        userId: 'YOxqioCO5LTSEWXqnN2Gnm6obvH3'
                    }
                }).then(async () => {
                    return firestore().collection('routings').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').get().then((doc) => {
                        return assert.equal(doc.data()['status'], 'active');
                    });
                });
            });
        });
        describe('createRoute', async () => {
            it('should find a route to Das Goldberg for User Seitenstten because the right target group is set', async () => {
                const wrapped = test.wrap(myFunctions.createRouting);
                await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').set(beforeRequest);
                const beforeSnap = await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').get();
                await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').set({
                    checkAddress: false,
                    startAddress: defaultCityAddress,
                    endAddress: '__COU__AT__CIT__Bad Hofgastein__STR__Haltestellenweg__COM__DAS.GOLDBERG',
                });
                const afterSnap = await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').get();
                const dataRequests = test.makeChange(beforeSnap, afterSnap);
                return await wrapped(dataRequests, {
                    params: {
                        userId: 'YOxqioCO5LTSEWXqnN2Gnm6obvH3'
                    }
                }).then(async () => {
                    return firestore().collection('routings').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').get().then((doc) => {
                        return assert.equal(doc.data()['status'], 'active');
                    });
                });
            });
        });
        describe('createRoute', async () => {
            it('should find a route to Stift Seitentetten for User Seitenstten because the right target group is set', async () => {
                const wrapped = test.wrap(myFunctions.createRouting);
                await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').set(beforeRequest);
                const beforeSnap = await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').get();
                await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').set({
                    checkAddress: false,
                    startAddress: defaultCityAddress,
                    endAddress: '__COU__AT__CIT__Seitenstetten__STR__Am Klosterberg__COM__Stift Seitenstetten',
                });
                const afterSnap = await firestore().collection('requests').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').get();
                const dataRequests = test.makeChange(beforeSnap, afterSnap);
                return await wrapped(dataRequests, {
                    params: {
                        userId: 'YOxqioCO5LTSEWXqnN2Gnm6obvH3'
                    }
                }).then(async () => {
                    return firestore().collection('routings').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').get().then((doc) => {
                        return assert.equal(doc.data()['status'], 'active');
                    });
                });
            });
        });
        describe('createRoute', async () => {
            it('should find NOT a route to Das Goldberg for User2 Seitenstten because the wrong target group is set', async () => {
                const wrapped = test.wrap(myFunctions.createRouting);
                await firestore().collection('requests').doc('2MGuqfYn6NVx555UpsJ08EqFqJN2').set(beforeRequest);
                const beforeSnap = await firestore().collection('requests').doc('2MGuqfYn6NVx555UpsJ08EqFqJN2').get();
                await firestore().collection('requests').doc('2MGuqfYn6NVx555UpsJ08EqFqJN2').set({
                    checkAddress: false,
                    startAddress: defaultCityAddress,
                    endAddress: '__COU__AT__CIT__Bad Hofgastein__STR__Haltestellenweg__COM__DAS.GOLDBERG',
                });
                const afterSnap = await firestore().collection('requests').doc('2MGuqfYn6NVx555UpsJ08EqFqJN2').get();
                const dataRequests = test.makeChange(beforeSnap, afterSnap);
                return await wrapped(dataRequests, {
                    params: {
                        userId: '2MGuqfYn6NVx555UpsJ08EqFqJN2'
                    }
                }).then(async () => {
                    return firestore().collection('routings').doc('2MGuqfYn6NVx555UpsJ08EqFqJN2').get().then((doc) => {
                        return assert.equal(doc.data()['status'], 'unavailable');
                    });
                });
            });
        });
        describe('createRoute', async () => {
            it('should find a route to Seitenstetten for User2 because no target group is set', async () => {
                const wrapped = test.wrap(myFunctions.createRouting);
                await firestore().collection('requests').doc('2MGuqfYn6NVx555UpsJ08EqFqJN2').set(beforeRequest);
                const beforeSnap = await firestore().collection('requests').doc('2MGuqfYn6NVx555UpsJ08EqFqJN2').get();
                await firestore().collection('requests').doc('2MGuqfYn6NVx555UpsJ08EqFqJN2').set({
                    checkAddress: false,
                    startAddress: '__COU__AT__CIT__Seitenstetten__STR__Waidhofner',
                    endAddress: defaultCityAddress,
                });
                const afterSnap = await firestore().collection('requests').doc('2MGuqfYn6NVx555UpsJ08EqFqJN2').get();
                const dataRequests = test.makeChange(beforeSnap, afterSnap);
                return await wrapped(dataRequests, {
                    params: {
                        userId: '2MGuqfYn6NVx555UpsJ08EqFqJN2'
                    }
                }).then(async () => {
                    return firestore().collection('routings').doc('2MGuqfYn6NVx555UpsJ08EqFqJN2').get().then((doc) => {
                        return assert.equal(doc.data()['status'], 'active');
                    });
                });
            });
        });


        describe('confirmPartnership', async () => {
            it('should set partnershipConfirmed in Lisec Seitenstettten providers to true', async () => {
                const wrapped = test.wrap(myFunctions.confirmedPartnership);
                await firestore().collection('providers').doc('TYOFztSh4uOJpqKowJS5YqC7KSJ2').set({
                    partners: ['lKYkhwAJTDUQy0uEBHZlpcERwvX2']
                }, { merge: true }
                );
                const beforeSnap = await firestore().collection('providers').doc('TYOFztSh4uOJpqKowJS5YqC7KSJ2').get();
                await firestore().collection('providers').doc('TYOFztSh4uOJpqKowJS5YqC7KSJ2').set({
                    partners: ['lKYkhwAJTDUQy0uEBHZlpcERwvX2', 'KOvDYdBJ2Ba3AXGNzlK7ACswBky2']
                }, { merge: true });
                const afterSnap = await firestore().collection('providers').doc('TYOFztSh4uOJpqKowJS5YqC7KSJ2').get();
                const dataRequests = test.makeChange(beforeSnap, afterSnap);
                return await wrapped(dataRequests, {
                    params: {
                        userId: 'TYOFztSh4uOJpqKowJS5YqC7KSJ2'
                    }
                }).then(async () => {
                    return firestore().collection('providers').doc('KOvDYdBJ2Ba3AXGNzlK7ACswBky2').get().then((doc) => {
                        return assert.equal(doc.data()['partnershipConfirmed'], true);
                    });
                });
            });
        });
        describe('confirmPartnership', async () => {
            it('should set partnershipConfirmed in Lisec Seitenstettten providers to true', async () => {
                const wrapped = test.wrap(myFunctions.confirmedPartnership);
                await firestore().collection('providers').doc('TYOFztSh4uOJpqKowJS5YqC7KSJ2').set({
                    partners: ['lKYkhwAJTDUQy0uEBHZlpcERwvX2', 'KOvDYdBJ2Ba3AXGNzlK7ACswBky2']
                }, { merge: true }
                );
                const beforeSnap = await firestore().collection('providers').doc('TYOFztSh4uOJpqKowJS5YqC7KSJ2').get();
                await firestore().collection('providers').doc('TYOFztSh4uOJpqKowJS5YqC7KSJ2').set({
                    partners: ['lKYkhwAJTDUQy0uEBHZlpcERwvX2']
                }, { merge: true });
                const afterSnap = await firestore().collection('providers').doc('TYOFztSh4uOJpqKowJS5YqC7KSJ2').get();
                const dataRequests = test.makeChange(beforeSnap, afterSnap);
                return await wrapped(dataRequests, {
                    params: {
                        userId: 'TYOFztSh4uOJpqKowJS5YqC7KSJ2'
                    }
                }).then(async () => {
                    return firestore().collection('providers').doc('KOvDYdBJ2Ba3AXGNzlK7ACswBky2').get().then((doc) => {
                        return assert.equal(doc.data()['partnershipConfirmed'], false);
                    });
                });
            });
        });

    });
};

exports.test = test;
