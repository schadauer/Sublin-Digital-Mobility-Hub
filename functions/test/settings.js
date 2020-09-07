const delimiter = require('../lib/types/delimiter');


const data = {
    // First we need to set up the users
    setUserSeitenstetten: `firestore().collection('users').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').set({
        uid: 'YOxqioCO5LTSEWXqnN2Gnm6obvH3',
        email: 'user@sublin.app',
        firstName: 'User Seitenstetten',
        homeAddress: 'Waidhofner Straße 6',
        isRegistrationCompleted: true,
        communes: ['__COU__AT__CIT__Seitenstetten'],
        requestedAddresses: [], 
        userType: 'user',
        secondName: '', 
    })`,
    setUserSponsorShuttleAllSeitenstetten: `firestore().collection('users').doc('b1cdh5A7zfUnwqi9nQoUU4iZKa92').set({
        uid: 'b1cdh5A7zfUnwqi9nQoUU4iZKa92',
        email: 'sponsorshuttle_all_seitenstetten@sublin.app',
        firstName: 'UserSponsorShuttleAllSeitenstetten',
        homeAddress: 'Waidhofner Straße 6',
        isRegistrationCompleted: true,
        communes: ['seitenstetten'],
        requestedAddresses: [],
        userType: 'sponsor',
        secondName: '',
    })`,
    setUserTaxiSeitenstetten: `firestore().collection('users').doc('TYOFztSh4uOJpqKowJS5YqC7KSJ2').set({
        uid: 'TYOFztSh4uOJpqKowJS5YqC7KSJ2',
        email: 'taxi_seitenstetten@sublin.app',
        firstName: 'Taxi Seitenstetten',
        homeAddress: 'Waidhofner Straße 6',
        isRegistrationCompleted: true,
        communes: [],
        requestedAddresses: [],
        userType: 'provider',
        secondName: '',
    })`,
    setUserSponsorAllSeitenstetten: `firestore().collection('users').doc('lKYkhwAJTDUQy0uEBHZlpcERwvX2').set({ \
        uid: 'lKYkhwAJTDUQy0uEBHZlpcERwvX2',
        email: 'sponsor_all_seitenstetten@sublin.app',
        firstName: 'UserSponsorShuttleAllSeitenstetten',
        homeAddress: 'Waidhofner Straße 6',
        isRegistrationCompleted: true,
        communes: [],
        requestedAddresses: [], 
        userType: 'sponsor',
        secondName: '',
    })`,
    // Now we need to set up the providers docs for the providers
    setProviderSponsorAllSeitenstetten: `firestore().collection('providers').doc('b1cdh5A7zfUnwqi9nQoUU4iZKa92').set({ 
        addresses: ['${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten${delimiter.STREET}Waidhofner Straße${delimiter.NUMBER}6',
            '${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten${delimiter.STREET}Waidhofner Straße',
            '${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten'
        ],
        inOperation: true,
        operationRequested: true,
        providerName: 'UserSponsorAllSeitenstetten',
        providerPlan: 'all',
        providerType: 'sponsor',
        targetGroup: [],
        partners: ['TYOFztSh4uOJpqKowJS5YqC7KSJ2'],
        outOfWork: false,
        stations: ['${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten${delimiter.STATION}Bahnhof St.Peter Seitenstetten${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten'],
        timeEnd: 2200,
        timeStart: 600
    })`,
    setProviderTaxiSeitenstetten: `firestore().collection('providers').doc('TYOFztSh4uOJpqKowJS5YqC7KSJ2').set({ 
        addresses: ['${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten${delimiter.STREET}Waidhofner Straße${delimiter.NUMBER}6',
            '${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten${delimiter.STREET}Waidhofner Straße',
            '${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten'
        ],
        inOperation: true,
        operationRequested: true,
        providerName: 'TaxiSeitenstetten',
        providerPlan: 'all',
        providerType: 'taxi',
        targetGroup: [],
        partners: [],
        outOfWork: false,
        stations: ['${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten${delimiter.STATION}Bahnhof St.Peter Seitenstetten${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten'],
        timeEnd: 2200,
        timeStart: 600
    })`,

}

exports.data = data;