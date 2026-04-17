export async function enterReservationCreate({ store, dispatch, payload }) {
    if (!payload?.roomId) {
        store.setState((current) => ({
            ...current,
            ui: {
                ...current.ui,
                mode: 'ERROR',
                status: 'ERROR',
                errorMessage: 'Chybí identifikátor pokoje pro rezervaci.',
            },
        }));
        return;
    }

    const state = store.getState();
    const token = state.auth.token;

    if (!token) {
        return dispatch({ type: 'ENTER_LOGIN' });
    }

    const { checkIn, checkOut } = state.ui.roomFilters ?? {};
    if (!checkIn || !checkOut) {
        alert('Před rezervací musíte vyplnit termín (příjezd a odjezd) ve filtru.');
        return dispatch({
            type: 'ENTER_ROOM_LIST',
            payload: { hotelId: state.ui.selectedHotelId },
        });
    }

    const room = (state.rooms ?? []).find((r) => r.id === payload.roomId) ?? null;

    store.setState((current) => ({
        ...current,
        reservationDraft: {
            roomId: payload.roomId,
            room,
            checkIn,
            checkOut,
        },
        ui: {
            ...current.ui,
            mode: 'RESERVATION_CREATE',
            status: 'READY',
            errorMessage: null,
        },
    }));
}
