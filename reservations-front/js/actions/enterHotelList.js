export function enterHotelList({ store }) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      mode: 'HOTEL_LIST',
      status: 'READY',
      errorMessage: null,
    },
  }));
}
