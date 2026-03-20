import { appInit } from '../actions/appInit.js';
import { enterHotelList } from '../actions/enterHotelList.js';
import { enterLogin } from '../actions/enterLogin.js';
import { loginSubmit } from '../actions/loginSubmit.js';
import { logout } from '../actions/logout.js';
import { enterHotelDetail } from '../actions/enterHotelDetail.js';

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

      case 'LOGIN_SUBMIT':
        return loginSubmit({ store, api, dispatch, payload });

      case 'LOGOUT':
        return logout({ store, dispatch });

      default:
        console.warn(`Unknown action type: ${type}`);
    }
  };
}
