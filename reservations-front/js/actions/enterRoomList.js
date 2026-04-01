export async function enterRoomList({ store, api, payload }) {
  const { hotelId, filters } = payload;
  const activeFilters = filters ?? { checkIn: '', checkOut: '', capacity: 0, maxPrice: '', roomTypeId: 0, amenityCodes: [] };

  store.setState((state) => ({
    ...state,
    rooms: [],
    availableRoomTypes: [],
    ui: {
      ...state.ui,
      mode: 'ROOM_LIST',
      status: 'LOADING',
      selectedHotelId: hotelId,
      errorMessage: null,
      roomFilters: activeFilters,
    },
  }));

  const params = new URLSearchParams({ hotelId });
  if (activeFilters.checkIn)        params.set('checkIn', activeFilters.checkIn);
  if (activeFilters.checkOut)       params.set('checkOut', activeFilters.checkOut);
  if (activeFilters.capacity > 0)   params.set('capacity', String(activeFilters.capacity));
  if (activeFilters.maxPrice)       params.set('maxPrice', activeFilters.maxPrice);
  if (activeFilters.roomTypeId > 0) params.set('roomTypeId', String(activeFilters.roomTypeId));
  activeFilters.amenityCodes.forEach((code) => params.append('amenities', code));

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
      ui: { ...state.ui, status: 'READY' },
    }));
  } else {
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        status: 'ERROR',
        errorMessage: result.reason ?? 'Nepodařilo se načíst pokoje.',
      },
    }));
  }
}
