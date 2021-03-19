import * as admin from 'firebase-admin';

admin.initializeApp();
export { createRouting } from './create_routing/index';
export { createBooking } from './create_booking/index';
export { setProviderToCompleted } from './set_provider_to_completed/index';
export { createConfirmBooking } from './create_confirmed_booking/index';
export { createCompletedBooking } from './create_completed_booking';
export { confirmedPartnership } from './confirm_partnership';