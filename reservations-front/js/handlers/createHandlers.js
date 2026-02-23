export function createHandlers(dispatch, viewState) {
  switch (viewState.type) {
    case 'HOTEL_LIST':
      return hotelListHandlers(dispatch, viewState);

    case 'ERROR':
      return errorHandlers(dispatch);

    default:
      return {};
  }
}

function hotelListHandlers(dispatch, viewState) {
  return {};
}

function errorHandlers(dispatch) {
  return {
    onContinue: () => dispatch({ type: 'ENTER_HOTEL_LIST' }),
  };
}
