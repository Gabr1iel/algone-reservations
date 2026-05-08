export async function enterAdminReservations({ store, api, dispatch, payload = {} }) {
    const auth = store.getState().auth;

    if (auth.role !== 'ADMIN') {
        store.setState((state) => ({
            ...state,
            ui: {
                ...state.ui,
                returnAction: { type: 'ENTER_ADMIN_RESERVATIONS' },
            },
        }));
        return dispatch({ type: 'ENTER_LOGIN' });
    }

    const filter = payload.statusFilter ?? store.getState().admin.reservationStatusFilter ?? 'ALL';

    store.setState((state) => ({
        ...state,
        admin: {
            ...state.admin,
            reservationStatusFilter: filter,
        },
        ui: {
            ...state.ui,
            mode: 'ADMIN_RESERVATIONS',
            status: 'LOADING',
            errorMessage: null,
            adminError: null,
        },
    }));

    const path = filter === 'ALL'
        ? '/admin/reservations'
        : `/admin/reservations?status=${encodeURIComponent(filter)}`;

    const result = await api.get(path, auth.token);

    if (result.status === 'SUCCESS') {
        store.setState((state) => ({
            ...state,
            admin: {
                ...state.admin,
                reservations: result.reservations ?? [],
            },
            ui: {
                ...state.ui,
                mode: 'ADMIN_RESERVATIONS',
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
            mode: 'ADMIN_RESERVATIONS',
            status: 'READY',
            adminError: result.reason || 'Nepodařilo se načíst rezervace.',
        },
    }));
}
