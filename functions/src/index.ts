import * as admin from 'firebase-admin';

admin.initializeApp();
//export { admin };
export { createRouting } from './routing/index';
export { createBooking } from './booking/index';
export { checkProviderStatus } from './provider/index';
