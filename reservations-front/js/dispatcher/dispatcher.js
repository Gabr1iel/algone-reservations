import { appInit } from '../actions/appInit.js';
import { enterHotelList } from '../actions/enterHotelList.js';
import { enterLogin } from '../actions/enterLogin.js';
import { enterRegister } from '../actions/enterRegister.js';
import { loginSubmit } from '../actions/loginSubmit.js';
import { registerSubmit } from "../actions/registerSubmit.js";
import { logout } from '../actions/logout.js';
import { enterHotelDetail } from '../actions/enterHotelDetail.js';
import { enterRoomList } from '../actions/enterRoomList.js';
import { roomSearch } from '../actions/roomSearch.js';
import { enterUserDetail } from '../actions/enterUserDetail.js';
import { enterUserEditProfile } from '../actions/enterUserEditProfile.js';
import { enterUserEditEmail } from '../actions/enterUserEditEmail.js';
import { enterUserEditPassword } from '../actions/enterUserEditPassword.js';
import { updateProfile } from '../actions/updateProfile.js';
import { updateEmail } from '../actions/updateEmail.js';
import { updatePassword } from '../actions/updatePassword.js';
import { enterMyReservations } from '../actions/enterMyReservations.js';
import { enterReservationCreate } from '../actions/enterReservationCreate.js';
import { submitReservation } from '../actions/submitReservation.js';
import { cancelReservation } from '../actions/cancelReservation.js';
import { enterReservationPayments } from '../actions/enterReservationPayments.js';
import { createPayment } from '../actions/createPayment.js';

export function createDispatcher(store, api) {
  return async function dispatch(action) {
    const { type, payload = {} } = action ?? {};

    const NON_RETURN_ACTIONS = ['ENTER_LOGIN', 'ENTER_REGISTER', 'APP_INIT'];
    if (type?.startsWith('ENTER_') && !NON_RETURN_ACTIONS.includes(type)) {
      store.setState((s) => ({ ...s, ui: { ...s.ui, returnAction: action } }));
    }

    switch (type) {
      case 'APP_INIT':
        return appInit({ store, api, dispatch });

      case 'ENTER_HOTEL_LIST':
        return enterHotelList({ store });

      case 'ENTER_HOTEL_DETAIL':
        return enterHotelDetail({ store, api, payload });

      case 'ENTER_LOGIN':
        return enterLogin({ store });

      case 'ENTER_REGISTER':
        return enterRegister({ store });

      case 'LOGIN_SUBMIT':
        return loginSubmit({ store, api, dispatch, payload });

      case 'REGISTER_SUBMIT':
        return registerSubmit({ store, api, dispatch, payload });

      case 'ENTER_ROOM_LIST':
        return enterRoomList({ store, api, payload });

      case 'ROOM_SEARCH':
        return roomSearch({ store, api, payload });

      case 'ENTER_USER_DETAIL':
        return enterUserDetail({ store, api });

      case 'ENTER_USER_EDIT_PROFILE':
        return enterUserEditProfile({ store });

      case 'ENTER_USER_EDIT_EMAIL':
        return enterUserEditEmail({ store });

      case 'ENTER_USER_EDIT_PASSWORD':
        return enterUserEditPassword({ store });

      case 'UPDATE_PROFILE':
        return updateProfile({ store, api, dispatch, payload });

      case 'UPDATE_EMAIL':
        return updateEmail({ store, api, dispatch, payload });

      case 'UPDATE_PASSWORD':
        return updatePassword({ store, api, dispatch, payload });

      case 'ENTER_MY_RESERVATIONS':
        return enterMyReservations({ store, api });

      case 'ENTER_RESERVATION_CREATE':
        return enterReservationCreate({ store, dispatch, payload });

      case 'SUBMIT_RESERVATION':
        return submitReservation({ store, api, dispatch });

      case 'CANCEL_RESERVATION':
        return cancelReservation({ store, api, dispatch, payload });

      case 'ENTER_RESERVATION_PAYMENTS':
        return enterReservationPayments({ store, api, payload });

      case 'CREATE_PAYMENT':
        return createPayment({ store, api, dispatch, payload });

      case 'LOGOUT':
        return logout({ store, dispatch });

      default:
        console.warn(`Unknown action type: ${type}`);
    }
  };
}
