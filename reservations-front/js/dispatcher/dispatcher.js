import { appInit } from '../actions/appInit.js';
import { enterHotelList } from '../actions/enterHotelList.js';

export function createDispatcher(store, api) {
  return async function dispatch(action) {
    const { type, payload = {} } = action ?? {};

    switch (type) {
      case 'APP_INIT':
        return appInit({ store, api, dispatch });

      case 'ENTER_HOTEL_LIST':
        return enterHotelList({ store });

      default:
        console.warn(`Unknown action type: ${type}`);
    }
  };
}
