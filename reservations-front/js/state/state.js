export function createInitialState() {
  return {
    hotels: [],
    selectedHotel: null,

    auth: {
      role: 'ANONYMOUS',
      userId: null,
      token: null,
      email: null,
      firstName: null,
      lastName: null,
    },

    ui: {
      mode: 'HOTEL_LIST',
      status: 'LOADING',
      selectedHotelId: null,
      errorMessage: null,
      notification: null,
      loginError: null,
      registerError: null,
      isSubmitting: false,
      returnAction: null,
    },
  };
}
