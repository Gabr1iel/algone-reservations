export function createHandlers(dispatch, viewState) {
  switch (viewState.type) {
    case 'HOTEL_LIST':
      return hotelListHandlers(dispatch, viewState);

    case 'HOTEL_DETAIL':
      return hotelDetailHandlers(dispatch, viewState);

    case 'LOGIN':
      return loginHandlers(dispatch, viewState);

    case 'REGISTER':
      return registerHandlers(dispatch, viewState);

    case 'ROOM_LIST':
      return roomListHandlers(dispatch, viewState);

    case 'USER_DETAIL':
      return userDetailHandlers(dispatch, viewState);

    case 'USER_EDIT_PROFILE':
      return userEditProfileHandlers(dispatch, viewState);

    case 'USER_EDIT_EMAIL':
      return userEditEmailHandlers(dispatch, viewState);

    case 'USER_EDIT_PASSWORD':
      return userEditPasswordHandlers(dispatch, viewState);

    case 'MY_RESERVATIONS':
      return myReservationsHandlers(dispatch, viewState);

    case 'RESERVATION_CREATE':
      return reservationCreateHandlers(dispatch, viewState);

    case 'RESERVATION_PAYMENTS':
      return reservationPaymentsHandlers(dispatch, viewState);

    case 'ADMIN_DASHBOARD':
      return adminDashboardHandlers(dispatch, viewState);

    case 'ADMIN_RESERVATIONS':
      return adminReservationsHandlers(dispatch, viewState);

    case 'ADMIN_USERS':
      return adminUsersHandlers(dispatch, viewState);

    case 'ADMIN_ROOMS':
      return adminRoomsHandlers(dispatch, viewState);

    case 'ADMIN_ROOM_FORM':
      return adminRoomFormHandlers(dispatch, viewState);

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
        case 'USER_DETAIL':
          return dispatch({ type: 'ENTER_USER_DETAIL' });
        case 'MY_RESERVATIONS':
          return dispatch({ type: 'ENTER_MY_RESERVATIONS' });
        case 'ADMIN_DASHBOARD':
          return dispatch({ type: 'ENTER_ADMIN_DASHBOARD' });
        case 'ADMIN_RESERVATIONS':
          return dispatch({ type: 'ENTER_ADMIN_RESERVATIONS' });
        case 'ADMIN_USERS':
          return dispatch({ type: 'ENTER_ADMIN_USERS' });
        case 'ADMIN_ROOMS':
          return dispatch({ type: 'ENTER_ADMIN_ROOMS' });
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
    onViewRooms: (hotelId) => dispatch({ type: 'ENTER_ROOM_LIST', payload: { hotelId } }),
    onRoomSearch: (filters) =>
        dispatch({ type: 'ENTER_ROOM_LIST', payload: { hotelId: viewState.hotel.id, filters } }),
  };
}

function roomListHandlers(dispatch, viewState) {
  return {
    onGoBack: () => dispatch({ type: 'ENTER_HOTEL_DETAIL', payload: { hotelId: viewState.hotelId } }),
    onRoomSearch: (filters) =>
        dispatch({ type: 'ROOM_SEARCH', payload: { filters, hotelId: viewState.hotelId } }),
    onReserveRoom: (roomId) =>
        dispatch({ type: 'ENTER_RESERVATION_CREATE', payload: { roomId } }),
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

function registerHandlers(dispatch, viewState) {
  return {
    onGoToLogin: () => dispatch({ type: 'ENTER_LOGIN' }),
    onRegister: (firstName, lastName, email, password) =>
        dispatch({ type: 'REGISTER_SUBMIT', payload: { firstName, lastName, email, password } }),
    onGoBack: () => dispatch({ type: 'ENTER_HOTEL_LIST' }),
  };
}

function errorHandlers(dispatch) {
  return {
    onContinue: () => dispatch({ type: 'ENTER_HOTEL_LIST' }),
  };
}

function userDetailHandlers(dispatch, viewState) {
  return {
    onGoBack: () => dispatch({ type: 'ENTER_HOTEL_LIST' }),
    onEditProfile: () => dispatch({ type: 'ENTER_USER_EDIT_PROFILE' }),
    onEditEmail: () => dispatch({ type: 'ENTER_USER_EDIT_EMAIL' }),
    onEditPassword: () => dispatch({ type: 'ENTER_USER_EDIT_PASSWORD' }),
  };
}

function userEditProfileHandlers(dispatch, viewState) {
  return {
    onCancel: () => dispatch({ type: 'ENTER_USER_DETAIL' }),
    onSaveProfile: (payload) => dispatch({ type: 'UPDATE_PROFILE', payload }),
  };
}

function userEditEmailHandlers(dispatch, viewState) {
  return {
    onCancel: () => dispatch({ type: 'ENTER_USER_DETAIL' }),
    onSaveEmail: (payload) => dispatch({ type: 'UPDATE_EMAIL', payload }),
  };
}

function userEditPasswordHandlers(dispatch, viewState) {
  return {
    onCancel: () => dispatch({ type: 'ENTER_USER_DETAIL' }),
    onSavePassword: (payload) => dispatch({ type: 'UPDATE_PASSWORD', payload }),
  };
}

function myReservationsHandlers(dispatch, viewState) {
  return {
    onGoBack: () => dispatch({ type: 'ENTER_HOTEL_LIST' }),
    onCancelReservation: (reservationId) =>
        dispatch({ type: 'CANCEL_RESERVATION', payload: { reservationId } }),
    onOpenPayments: (reservationId) =>
        dispatch({ type: 'ENTER_RESERVATION_PAYMENTS', payload: { reservationId } }),
  };
}

function reservationCreateHandlers(dispatch, viewState) {
  return {
    onGoBack: () => dispatch({ type: 'ENTER_HOTEL_LIST' }),
    onSubmitReservation: () => dispatch({ type: 'SUBMIT_RESERVATION' }),
  };
}

function reservationPaymentsHandlers(dispatch, viewState) {
  return {
    onGoBack: () => dispatch({ type: viewState.isAdmin ? 'ENTER_ADMIN_RESERVATIONS' : 'ENTER_MY_RESERVATIONS' }),
    onCreatePayment: (method) =>
        dispatch({ type: 'CREATE_PAYMENT', payload: { method } }),
    onChangePaymentStatus: (paymentId, newStatus) =>
        dispatch({ type: 'CHANGE_PAYMENT_STATUS', payload: { paymentId, newStatus } }),
  };
}

function adminDashboardHandlers(dispatch, viewState) {
  return {
    onGoBack: () => dispatch({ type: 'ENTER_HOTEL_LIST' }),
    onNavigate: (target) => {
      switch (target) {
        case 'ADMIN_RESERVATIONS':
          return dispatch({ type: 'ENTER_ADMIN_RESERVATIONS' });
        case 'ADMIN_USERS':
          return dispatch({ type: 'ENTER_ADMIN_USERS' });
        case 'ADMIN_ROOMS':
          return dispatch({ type: 'ENTER_ADMIN_ROOMS' });
        default:
          console.warn(`Unknown admin navigation target: ${target}`);
      }
    },
  };
}

function adminReservationsHandlers(dispatch, viewState) {
  return {
    onGoBack: () => dispatch({ type: 'ENTER_ADMIN_DASHBOARD' }),
    onStatusFilterChange: (statusFilter) =>
        dispatch({ type: 'ENTER_ADMIN_RESERVATIONS', payload: { statusFilter } }),
    onChangeStatus: (reservationId, newStatus) =>
        dispatch({
          type: 'CHANGE_RESERVATION_STATUS',
          payload: { reservationId, newStatus },
        }),
    onOpenPayments: (reservationId) =>
        dispatch({ type: 'ENTER_RESERVATION_PAYMENTS', payload: { reservationId } }),
  };
}

function adminUsersHandlers(dispatch, viewState) {
  return {
    onGoBack: () => dispatch({ type: 'ENTER_ADMIN_DASHBOARD' }),
    onDeleteUser: (userId) => dispatch({ type: 'DELETE_USER', payload: { userId } }),
  };
}

function adminRoomsHandlers(dispatch, viewState) {
  return {
    onGoBack: () => dispatch({ type: 'ENTER_ADMIN_DASHBOARD' }),
    onCreateRoom: () => dispatch({ type: 'ENTER_ADMIN_ROOM_FORM' }),
    onEditRoom: (roomId) => dispatch({ type: 'ENTER_ADMIN_ROOM_FORM', payload: { roomId } }),
    onToggleActive: (roomId, active) =>
        dispatch({ type: 'TOGGLE_ROOM_ACTIVE', payload: { roomId, active } }),
    onHotelFilterChange: (hotelFilter) =>
        dispatch({ type: 'ENTER_ADMIN_ROOMS', payload: { hotelFilter } }),
  };
}

function adminRoomFormHandlers(dispatch, viewState) {
  return {
    onCancel: () => dispatch({ type: 'ENTER_ADMIN_ROOMS' }),
    onSubmitRoom: (payload) => dispatch({ type: 'SUBMIT_ROOM', payload }),
  };
}
