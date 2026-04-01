export async function roomSearch({ store, api, payload }) {
  const { filters, hotelId } = payload;

  store.setState((state) => ({
    ...state,
    ui: { ...state.ui, roomsLoading: true, roomFilters: filters },
  }));

  const params = new URLSearchParams({ hotelId });
  if (filters.checkIn)        params.set('checkIn', filters.checkIn);
  if (filters.checkOut)       params.set('checkOut', filters.checkOut);
  if (filters.capacity > 0)   params.set('capacity', String(filters.capacity));
  if (filters.maxPrice)       params.set('maxPrice', filters.maxPrice);
  if (filters.roomTypeId > 0) params.set('roomTypeId', String(filters.roomTypeId));
  filters.amenityCodes.forEach((code) => params.append('amenities', code));

  const result = await api.get(`/rooms?${params.toString()}`);

  if (result.status === 'SUCCESS') {
    store.setState((state) => ({
      ...state,
      rooms: result.rooms ?? [],
      ui: { ...state.ui, roomsLoading: false },
    }));
  } else {
    store.setState((state) => ({
      ...state,
      ui: { ...state.ui, roomsLoading: false },
    }));
  }
}
