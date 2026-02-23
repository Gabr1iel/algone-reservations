export function selectHotels(state) {
  return state.hotels ?? [];
}

export function selectHotelListView(state) {
  return {
    type: 'HOTEL_LIST',
    hotels: selectHotels(state),
    capabilities: {},
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
    default:
      return { type: 'ERROR', message: `Unknown ui mode: ${mode}` };
  }
}
