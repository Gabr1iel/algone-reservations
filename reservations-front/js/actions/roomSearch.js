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
    const rooms = result.rooms ?? [];

    const typeMap = {};
    rooms.forEach((r) => { typeMap[r.roomTypeId] = r.roomTypeName; });
    const availableRoomTypes = Object.entries(typeMap).map(([id, name]) => ({ id: Number(id), name }));

    store.setState((state) => ({
      ...state,
      rooms,
      availableRoomTypes,
      ui: { ...state.ui, roomsLoading: false, roomsError: null },
    }));
  } else {
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        roomsLoading: false,
        roomsError: result.reason ?? 'Nepodařilo se vyhledat pokoje.',
      },
    }));
  }
}
