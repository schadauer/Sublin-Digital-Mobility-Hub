const delimiter = require('../lib/types/delimiter');
const crypto = require("crypto");

const email = 'user@sublin.app';
const emailSha256 = crypto.createHash('sha256').update(email).digest('hex')


const data = {
    // First we need to set up the users
    setUserSeitenstetten: `firestore().collection('users').doc('YOxqioCO5LTSEWXqnN2Gnm6obvH3').set({
        uid: 'YOxqioCO5LTSEWXqnN2Gnm6obvH3',
        email: 'user@sublin.app',
        firstName: 'User Seitenstetten',
        homeAddress: 'Waidhofner Straße 6',
        isRegistrationCompleted: true,
        communes: ['__COU__AT__CIT__Seitenstetten', '__COU__AT__CIT__Biberbach'],
        requestedAddresses: [], 
        userType: 'user',
        secondName: '', 
    })`,
    setUserLisecAllSeitenstetten: `firestore().collection('users').doc('b1cdh5A7zfUnwqi9nQoUU4iZKa92').set({
        uid: 'b1cdh5A7zfUnwqi9nQoUU4iZKa92',
        email: 'sponsorshuttle_all_seitenstetten@sublin.app',
        firstName: 'Lisec Seitenstetten',
        homeAddress: '',
        isRegistrationCompleted: true,
        communes: ['seitenstetten'],
        requestedAddresses: ['user@sublin.app'],
        userType: 'sponsor',
        secondName: '',
    })`,
    setUserStiftSeitenstettenSeitenstetten: `firestore().collection('users').doc('WXpz91NEodPbK6pM04V8OVgcOiu2').set({
        uid: 'WXpz91NEodPbK6pM04V8OVgcOiu2',
        email: 'stift_seitenstetten@sublin.app',
        firstName: 'Stift Seitenstetten Shuttle',
        homeAddress: '',
        isRegistrationCompleted: true,
        communes: [],
        requestedAddresses: ['user@sublin.app'],
        userType: 'provider',
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
        firstName: 'Gemeinde Seitenstetten',
        homeAddress: 'Waidhofner Straße 6',
        isRegistrationCompleted: true,
        communes: [],
        requestedAddresses: [], 
        userType: 'sponsor',
        secondName: '',
    })`,
    // Now we need to set up the providers docs for the providers
    setProviderGemeindeSeitenstetten: `firestore().collection('providers').doc('lKYkhwAJTDUQy0uEBHZlpcERwvX2').set({ 
        uid: 'lKYkhwAJTDUQy0uEBHZlpcERwvX2',
        addresses: ['${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten${delimiter.STREET}Waidhofner Straße${delimiter.NUMBER}6',
            '${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten${delimiter.STREET}Waidhofner Straße',
            '${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten'
        ],
        inOperation: true,
        communes: ['__COU__AT__CIT__Seitenstetten',],
        operationRequested: true,
        providerName: 'Gemeinde Seitenstetten',
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
        uid: 'TYOFztSh4uOJpqKowJS5YqC7KSJ2',
        addresses: ['${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten${delimiter.STREET}Waidhofner Straße${delimiter.NUMBER}6',
            '${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten${delimiter.STREET}Waidhofner Straße',
            '${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten'
        ],
        inOperation: true,
        communes: ['__COU__AT__CIT__Seitenstetten'],
        operationRequested: true,
        providerName: 'Taxi Seitenstetten',
        providerPlan: 'all',
        providerType: 'taxi',
        targetGroup: [],
        partners: ['b1cdh5A7zfUnwqi9nQoUU4iZKa92'],
        outOfWork: false,
        stations: ['${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten${delimiter.STATION}Bahnhof St.Peter Seitenstetten${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten'],
        timeEnd: 2200,
        timeStart: 600
    })`,
    setProviderStiftSeitenstetten: `firestore().collection('providers').doc('WXpz91NEodPbK6pM04V8OVgcOiu2').set({ 
        uid: 'WXpz91NEodPbK6pM04V8OVgcOiu2',
        addresses: ['${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten${delimiter.STREET}Am Klosterberg${delimiter.COMPANY}Stift Seitenstetten'],
        inOperation: true,
        communes: ['__COU__AT__CIT__Seitenstetten'],
        operationRequested: true,
        providerName: 'Stift Seitenstetten',
        providerPlan: 'all',
        providerType: 'shuttle',
        targetGroup: [],
        partners: [],
        outOfWork: false,
        stations: ['${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten${delimiter.STATION}Bahnhof St.Peter Seitenstetten${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten'],
        timeEnd: 2200,
        timeStart: 600
    })`,
    setProviderLisecSeitenstetten: `firestore().collection('providers').doc('b1cdh5A7zfUnwqi9nQoUU4iZKa92').set({ 
        uid: 'b1cdh5A7zfUnwqi9nQoUU4iZKa92',
        addresses: ['${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten${delimiter.STREET}Peter-Lisec-Straße${delimiter.COMPANY}LISEC Austria GmbH',
        ],
        inOperation: true,
        communes: ['__COU__AT__CIT__Seitenstetten'],
        operationRequested: true,
        providerName: 'Lisec Seitenstetten',
        providerPlan: 'emailOnly',
        providerType: 'shuttleSponsor',
        targetGroup: ['${emailSha256}'],
        partners: ['TYOFztSh4uOJpqKowJS5YqC7KSJ2'],
        outOfWork: false,
        stations: ['${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten${delimiter.STATION}Bahnhof St.Peter Seitenstetten${delimiter.COUNTRY}AT${delimiter.CITY}Seitenstetten'],
        timeEnd: 2200,
        timeStart: 600
    })`,

}

exports.data = data;