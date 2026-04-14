export async function cancelReservation({ store, api, dispatch, payload }) {
    const token = store.getState().auth.token;
    const reservationId = payload?.reservationId;

    if (!token) {
        store.setState((current) => ({
            ...current,
            ui: {
                ...current.ui,
                mode: 'ERROR',
                status: 'ERROR',
                errorMessage: 'Pro zrušení rezervace se musíte nejdřív přihlásit.',
            },
        }));
        return;
    }

    if (!reservationId) {
        store.setState((current) => ({
            ...current,
            ui: {
                ...current.ui,
                mode: 'ERROR',
                status: 'ERROR',
                errorMessage: 'Chybí identifikátor rezervace.',
            },
        }));
        return;
    }

    const result = await api.put(`/reservations/${reservationId}/cancel`, {}, token);

    if (result.status === 'SUCCESS') {
        store.setState((current) => ({
            ...current,
            ui: {
                ...current.ui,
                notification: 'Rezervace byla úspěšně zrušena.',
            },
        }));

        return dispatch({ type: 'ENTER_MY_RESERVATIONS' });
    }

    store.setState((current) => ({
        ...current,
        ui: {
            ...current.ui,
            mode: 'ERROR',
            status: 'ERROR',
            errorMessage: result.reason || 'Nepodařilo se zrušit rezervaci.',
        },
    }));
}