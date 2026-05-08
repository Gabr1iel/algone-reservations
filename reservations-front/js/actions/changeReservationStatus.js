export async function changeReservationStatus({ store, api, dispatch, payload }) {
    const { reservationId, newStatus } = payload ?? {};
    const token = store.getState().auth.token;

    if (!reservationId || !newStatus) {
        store.setState((state) => ({
            ...state,
            ui: {
                ...state.ui,
                adminError: 'Chybí identifikátor rezervace nebo cílový stav.',
            },
        }));
        return;
    }

    store.setState((state) => ({
        ...state,
        ui: { ...state.ui, isSubmitting: true, adminError: null },
    }));

    const result = await api.patch(
        `/admin/reservations/${reservationId}/status`,
        { status: newStatus },
        token
    );

    if (result.status === 'SUCCESS') {
        store.setState((state) => ({
            ...state,
            ui: {
                ...state.ui,
                isSubmitting: false,
                notification: `Stav rezervace změněn na ${newStatus}.`,
            },
        }));
        return dispatch({ type: 'ENTER_ADMIN_RESERVATIONS' });
    }

    store.setState((state) => ({
        ...state,
        ui: {
            ...state.ui,
            isSubmitting: false,
            adminError: result.reason || 'Nepodařilo se změnit stav rezervace.',
        },
    }));
}
