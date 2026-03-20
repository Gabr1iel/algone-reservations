export async function enterHotelDetail({ store, api, payload }) {
  const { hotelId } = payload;

  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      mode: 'HOTEL_DETAIL',
      status: 'LOADING',
      selectedHotelId: hotelId,
      errorMessage: null,
    },
  }));

  const result = await api.get(`/hotels/${hotelId}`);

  const { status, ...hotel } = result;

  if (status === 'SUCCESS') {
    store.setState((state) => ({
      ...state,
      selectedHotel: hotel,
      ui: { ...state.ui, status: 'READY' },
    }));
  } else {
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        status: 'ERROR',
        errorMessage: result.reason ?? 'Nepodařilo se načíst hotel.',
      },
    }));
  }
}
