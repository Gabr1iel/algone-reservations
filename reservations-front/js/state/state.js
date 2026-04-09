export function createInitialState() {
  return {
    hotels: [],
    selectedHotel: null,
    rooms: [],
    availableRoomTypes: [],
    userProfile: null,

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
      roomsLoading: false,
      roomsError: null,
      roomFilters: {
        checkIn: '',
        checkOut: '',
        capacity: 0,
        maxPrice: '',
        roomTypeId: 0,
        amenityCodes: [],
      },
    },
  };
}
