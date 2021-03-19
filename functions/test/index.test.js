
// You need to create the following environement variables
// export FIREBASE_DATABASEURL=""
// export FIREBASE_STORAGEBUCKET=""
// export FIREBASE_PROJECTID=""
// export FIREBASE_PROJECTURL=""
// export GOOGLE_PLACES_API=""
// export GOOGLE_DIRECTIONS_API=""

const { firestore } = require('firebase-admin');
const test = require('firebase-functions-test')({
    databaseURL: process.env.FIREBASE_DATABASEURL,
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    projectId: process.env.FIREBASE_PROJECTID,
}, process.env.FIREBASE_PROJECTURL);
// process.env.FIREBASE_PROJECTURL - this is the path to the credential file for Firebase
const assert = require('chai').assert;
const delimiter = require('../lib/types/delimiter');
const settings = require('./settings');
const functions = require('firebase-functions');

test.mockConfig({
    sublin: {
        "google_places_api": process.env.GOOGLE_PLACES_API,
        "google_directions_api": process.env.GOOGLE_DIRECTIONS_API
    }
});

const createRoutingTest = require('../src/create_routing/test/index.test');

createRoutingTest.test(test, delimiter, settings.data);


