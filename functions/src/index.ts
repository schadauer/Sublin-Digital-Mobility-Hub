import * as admin from 'firebase-admin';

admin.initializeApp();
//export { admin };
export { createRouting } from './routings/index';
export { createBooking } from './bookings/index';
export { checkProviderStatus } from './providers/index';
export { createConfirmBooking } from './confirmed_bookings/index';
