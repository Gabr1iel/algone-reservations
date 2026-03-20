export function selectHotels(state) {
  return state.hotels ?? [];
}

export function selectAuth(state) {
  return state.auth;
}

export function selectHotelName(state) {
  const hotels = selectHotels(state);
  return hotels.length > 0 ? hotels[0].name : 'Algone Reservations';
}

export function selectHotelListView(state) {
  return {
    type: 'HOTEL_LIST',
    hotels: selectHotels(state),
    capabilities: {},
  };
}

export function selectHotelDetailView(state) {
  const hotel = state.selectedHotel ?? {};
  return {
    type: 'HOTEL_DETAIL',
    hotel: {
      id: hotel.id,
      name: hotel.name ?? '',
      description: hotel.description ?? '',
      email: hotel.email ?? '',
      phone: hotel.phone ?? '',
      addressLine: hotel.addressLine ?? '',
      city: hotel.city ?? '',
      zip: hotel.zip ?? '',
      country: hotel.country ?? '',
      checkInFrom: hotel.checkInFrom ?? '',
      checkOutUntil: hotel.checkOutUntil ?? '',
    },
  };
}

export function selectLoginView(state) {
  return {
    type: 'LOGIN',
    loginError: state.ui.loginError ?? null,
    isSubmitting: state.ui.isSubmitting ?? false,
  };
}

export function selectLayoutData(state) {
  return {
    hotelName: selectHotelName(state),
    auth: selectAuth(state),
  };
}

export function selectViewState(state) {
  const { status, errorMessage, mode } = state.ui;

  if (status === 'LOADING') {
    return { type: 'LOADING' };
  }

  if (status === 'ERROR') {
    return { type: 'ERROR', message: errorMessage };
  }

  if (status !== 'READY') {
    return { type: 'ERROR', message: `Unknown ui status: ${status}` };
  }

  switch (mode) {
    case 'HOTEL_LIST':
      return selectHotelListView(state);
    case 'HOTEL_DETAIL':
      return selectHotelDetailView(state);
    case 'LOGIN':
      return selectLoginView(state);
    default:
      return { type: 'ERROR', message: `Unknown ui mode: ${mode}` };
  }
}
