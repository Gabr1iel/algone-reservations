export async function enterAdminRoomForm({ store, api, dispatch, payload = {} }) {
    const auth = store.getState().auth;

    if (auth.role !== 'ADMIN') {
        store.setState((state) => ({
            ...state,
            ui: { ...state.ui, returnAction: { type: 'ENTER_ADMIN_ROOM_FORM', payload } },
        }));
        return dispatch({ type: 'ENTER_LOGIN' });
    }

    const mode = payload.roomId ? 'EDIT' : 'CREATE';
    const fallbackHotelId = store.getState().hotels?.[0]?.id ?? null;
    const hotelId = payload.hotelId ?? fallbackHotelId;

    store.setState((state) => ({
        ...state,
        admin: { ...state.admin, selectedRoom: null, roomFormMode: mode },
        ui: { ...state.ui, mode: 'ADMIN_ROOM_FORM', status: 'LOADING', adminError: null },
    }));

    const roomResult = mode === 'EDIT'
        ? await api.get(`/admin/rooms/${payload.roomId}`, auth.token)
        : { status: 'SUCCESS', room: null };

    const selectedHotelId = roomResult.id ? roomResult.hotelId : hotelId;
    const roomTypesResult = selectedHotelId
        ? await api.get(`/room-types?hotelId=${encodeURIComponent(selectedHotelId)}`, auth.token)
        : { status: 'SUCCESS', roomTypes: [] };
    const amenitiesResult = await api.get('/amenities', auth.token);

    const failed = [roomResult, roomTypesResult, amenitiesResult].find((result) => result.status !== 'SUCCESS');

    store.setState((state) => ({
        ...state,
        admin: {
            ...state.admin,
            selectedRoom: mode === 'EDIT' ? roomResult : null,
            roomTypes: roomTypesResult.status === 'SUCCESS' ? roomTypesResult.roomTypes ?? [] : [],
            amenities: amenitiesResult.status === 'SUCCESS' ? amenitiesResult.amenities ?? [] : [],
            roomFormMode: mode,
        },
        ui: {
            ...state.ui,
            mode: 'ADMIN_ROOM_FORM',
            status: 'READY',
            adminError: failed ? failed.reason || 'Nepodařilo se načíst formulář pokoje.' : null,
        },
    }));
}
