export async function changePaymentStatus({ store, api, dispatch, payload }) {
    const token = store.getState().auth.token;
    const { paymentId, newStatus } = payload ?? {};
    const reservationId = store.getState().selectedReservationId;

    if (!paymentId || !newStatus) {
        store.setState((state) => ({
            ...state,
            ui: { ...state.ui, adminError: 'Chybí platba nebo cílový stav.' },
        }));
        return;
    }

    const result = await api.patch(`/admin/payments/${paymentId}/status`, { status: newStatus }, token);

    if (result.status === 'SUCCESS') {
        return dispatch({ type: 'ENTER_RESERVATION_PAYMENTS', payload: { reservationId } });
    }

    store.setState((state) => ({
        ...state,
        ui: { ...state.ui, adminError: result.reason || 'Nepodařilo se změnit stav platby.' },
    }));
}
