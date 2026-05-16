export async function enterAdminRooms({ store, api, dispatch, payload = {} }) {
    const auth = store.getState().auth;

    if (auth.role !== 'ADMIN') {
        store.setState((state) => ({
            ...state,
            ui: { ...state.ui, returnAction: { type: 'ENTER_ADMIN_ROOMS' } },
        }));
        return dispatch({ type: 'ENTER_LOGIN' });
    }

    const hotelFilter = payload.hotelFilter ?? store.getState().admin.roomHotelFilter ?? 'ALL';
    const query = hotelFilter === 'ALL' ? '' : `?hotelId=${encodeURIComponent(hotelFilter)}`;

    store.setState((state) => ({
        ...state,
        admin: { ...state.admin, roomHotelFilter: hotelFilter },
        ui: { ...state.ui, mode: 'ADMIN_ROOMS', status: 'LOADING', adminError: null },
    }));

    const result = await api.get(`/admin/rooms${query}`, auth.token);

    store.setState((state) => ({
        ...state,
        admin: {
            ...state.admin,
            rooms: result.status === 'SUCCESS' ? result.rooms ?? [] : state.admin.rooms,
        },
        ui: {
            ...state.ui,
            mode: 'ADMIN_ROOMS',
            status: 'READY',
            adminError: result.status === 'SUCCESS'
                ? null
                : result.reason || 'Nepodařilo se načíst pokoje.',
        },
    }));
}
