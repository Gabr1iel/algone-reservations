export async function createPayment({ store, api, dispatch, payload }) {
    const token = store.getState().auth.token;
    const reservationId = store.getState().selectedReservationId;
    const method = payload?.method;

    if (!token) {
        store.setState((current) => ({
            ...current,
            ui: {
                ...current.ui,
                mode: 'ERROR',
                status: 'ERROR',
                errorMessage: 'Pro vytvoření platby se musíte nejdřív přihlásit.',
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
                errorMessage: 'Chybí rezervace pro vytvoření platby.',
            },
        }));
        return;
    }

    if (!method) {
        store.setState((current) => ({
            ...current,
            ui: {
                ...current.ui,
                mode: 'ERROR',
                status: 'ERROR',
                errorMessage: 'Vyberte způsob platby.',
            },
        }));
        return;
    }

    const result = await api.post(
        `/reservations/${reservationId}/payments`,
        { method },
        token
    );

    if (result.status === 'SUCCESS') {
        store.setState((current) => ({
            ...current,
            ui: {
                ...current.ui,
                notification: 'Platba byla úspěšně vytvořena.',
            },
        }));

        return dispatch({
            type: 'ENTER_RESERVATION_PAYMENTS',
            payload: { reservationId },
        });
    }

    store.setState((current) => ({
        ...current,
        ui: {
            ...current.ui,
            mode: 'ERROR',
            status: 'ERROR',
            errorMessage: result.reason || 'Nepodařilo se vytvořit platbu.',
        },
    }));
}