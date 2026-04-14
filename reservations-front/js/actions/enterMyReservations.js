export async function enterMyReservations({ store, api }) {
    store.setState((state) => ({
        ...state,
        ui: {
            ...state.ui,
            mode: 'MY_RESERVATIONS',
            status: 'LOADING',
            errorMessage: null,
        },
    }));

    const token = store.getState().auth.token;
    const result = await api.get('/reservations/my', token);

    if (result.status === 'SUCCESS') {
        store.setState((state) => ({
            ...state,
            myReservations: result.reservations ?? [],
            ui: {
                ...state.ui,
                mode: 'MY_RESERVATIONS',
                status: 'READY',
                errorMessage: null,
            },
        }));
        return;
    }

    store.setState((state) => ({
        ...state,
        ui: {
            ...state.ui,
            mode: 'ERROR',
            status: 'ERROR',
            errorMessage: result.reason || 'Nepodařilo se načíst rezervace.',
        },
    }));
}