export async function enterReservationPayments({ store, api, payload }) {
    const token = store.getState().auth.token;
    const reservationId = payload?.reservationId;

    if (!token) {
        store.setState((current) => ({
            ...current,
            ui: {
                ...current.ui,
                mode: 'ERROR',
                status: 'ERROR',
                errorMessage: 'Pro zobrazení plateb se musíte nejdřív přihlásit.',
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

    store.setState((current) => ({
        ...current,
        selectedReservationId: reservationId,
        ui: {
            ...current.ui,
            mode: 'RESERVATION_PAYMENTS',
            status: 'LOADING',
            errorMessage: null,
        },
    }));

    const result = await api.get(`/reservations/${reservationId}/payments`, token);

    if (result.status === 'SUCCESS') {
        store.setState((current) => ({
            ...current,
            selectedReservationPayments: result.payments ?? [],
            ui: {
                ...current.ui,
                mode: 'RESERVATION_PAYMENTS',
                status: 'READY',
                errorMessage: null,
            },
        }));
        return;
    }

    store.setState((current) => ({
        ...current,
        ui: {
            ...current.ui,
            mode: 'ERROR',
            status: 'ERROR',
            errorMessage: result.reason || 'Nepodařilo se načíst platby.',
        },
    }));
}