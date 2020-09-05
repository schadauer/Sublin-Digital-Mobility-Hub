import * as admin from 'firebase-admin';
// import * as functions from 'firebase-functions';

admin.initializeApp();
//export { admin };
export { createRouting } from './create_routing/index';
export { createBooking } from './create_booking/index';
export { setProviderToCompleted } from './set_provider_to_completed/index';
export { createConfirmBooking } from './create_confirmed_booking/index';
export { createCompletedBooking } from './create_completed_booking';
// export { updateUserProfileFunction } from './update_user_profile';
// import { updateStations } from './scheduled_update_stations';

// void updateStations();

// exports.scheduledFunction = functions.pubsub.schedule('*/10 * * * *').onRun((context) => {
//     try {
//         void updateStations();
//     } catch (e) {
//         console.log(e);
//     }
// });
