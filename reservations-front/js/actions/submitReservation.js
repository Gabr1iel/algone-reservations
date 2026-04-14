export async function submitReservation({ store, api, dispatch }) {
    const state = store.getState();
    const draft = state.reservationDraft;
    const token = state.auth.token;

    if (!token) {
        store.setState((current) => ({
            ...current,
            ui: {
                ...current.ui,
                mode: 'ERROR',
                status: 'ERROR',
                errorMessage: 'Pro vytvoření rezervace se musíte nejdřív přihlásit.',
            },
        }));
        return;
    }

    if (!draft || !draft.roomId || !draft.checkIn || !draft.checkOut) {
        store.setState((current) => ({
            ...current,
            ui: {
                ...current.ui,
                mode: 'ERROR',
                status: 'ERROR',
                errorMessage: 'Chybí údaje pro vytvoření rezervace.',
            },
        }));
        return;
    }

    store.setState((current) => ({
        ...current,
        ui: {
            ...current.ui,
            mode: 'RESERVATION_CREATE',
            status: 'LOADING',
            errorMessage: null,
            isSubmitting: true,
        },
    }));

    const payload = {
        roomId: draft.roomId,
        checkIn: draft.checkIn,
        checkOut: draft.checkOut,
        note: draft.note ?? null,
    };

    const result = await api.post('/reservations', payload, token);

    if (result.status === 'SUCCESS') {
        store.setState((current) => ({
            ...current,
            reservationDraft: null,
            ui: {
                ...current.ui,
                notification: 'Rezervace byla úspěšně vytvořena.',
                isSubmitting: false,
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
            errorMessage: result.reason || 'Nepodařilo se vytvořit rezervaci.',
            isSubmitting: false,
        },
    }));
}