const { firestore } = require('firebase-admin');
const test = require('firebase-functions-test')({
    databaseURL: 'https://sublin-5a580.firebaseio.com',
    storageBucket: 'sublin-5a580.appspot.com',
    projectId: 'sublin-5a580',
}, '/Users/andreasschadauer/Development/sublin/Keys/sublin-project.json');
const assert = require('chai').assert;
const delimiter = require('../lib/types/delimiter');
const settings = require('./settings');

const createRoutingTest = require('../src/create_routing/test/index.test');

createRoutingTest.test(test, delimiter, settings.data);


