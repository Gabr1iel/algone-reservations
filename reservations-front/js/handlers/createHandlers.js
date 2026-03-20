export function createHandlers(dispatch, viewState) {
  switch (viewState.type) {
    case 'HOTEL_LIST':
      return hotelListHandlers(dispatch, viewState);

    case 'HOTEL_DETAIL':
      return hotelDetailHandlers(dispatch, viewState);

    case 'LOGIN':
      return loginHandlers(dispatch, viewState);

    case 'ERROR':
      return errorHandlers(dispatch);

    default:
      return {};
  }
}

export function createLayoutHandlers(dispatch) {
  return {
    onGoToLogin: () => dispatch({ type: 'ENTER_LOGIN' }),
    onLogout: () => dispatch({ type: 'LOGOUT' }),
    onNavigate: (target) => {
      switch (target) {
        case 'HOTEL_LIST':
          return dispatch({ type: 'ENTER_HOTEL_LIST' });
        default:
          console.warn(`Unknown navigation target: ${target}`);
      }
    },
  };
}

function hotelListHandlers(dispatch, viewState) {
  return {
    onHotelClick: (hotelId) => dispatch({ type: 'ENTER_HOTEL_DETAIL', payload: { hotelId } }),
  };
}

function hotelDetailHandlers(dispatch, viewState) {
  return {
    onGoBack: () => dispatch({ type: 'ENTER_HOTEL_LIST' }),
  };
}

function loginHandlers(dispatch, viewState) {
  return {
    onLogin: (email, password) =>
      dispatch({ type: 'LOGIN_SUBMIT', payload: { email, password } }),
    onGoToRegister: () => dispatch({ type: 'ENTER_REGISTER' }),
    onGoBack: () => dispatch({ type: 'ENTER_HOTEL_LIST' }),
  };
}

function errorHandlers(dispatch) {
  return {
    onContinue: () => dispatch({ type: 'ENTER_HOTEL_LIST' }),
  };
}
