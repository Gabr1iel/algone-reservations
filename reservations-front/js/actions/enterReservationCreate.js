export function enterReservationCreate({ store, payload }) {
    const state = store.getState();
    const room = (state.rooms ?? []).find((r) => r.id === payload.roomId) ?? null;

    store.setState((current) => ({
        ...current,
        reservationDraft: {
            roomId: payload.roomId,
            room,
            checkIn: current.ui.roomFilters.checkIn ?? '',
            checkOut: current.ui.roomFilters.checkOut ?? '',
        },
        ui: {
            ...current.ui,
            mode: 'RESERVATION_CREATE',
            status: 'READY',
            errorMessage: null,
        },
    }));
}