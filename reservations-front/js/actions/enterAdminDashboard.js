export function enterAdminDashboard({ store, dispatch }) {
    const auth = store.getState().auth;

    if (auth.role !== 'ADMIN') {
        store.setState((state) => ({
            ...state,
            ui: {
                ...state.ui,
                returnAction: { type: 'ENTER_ADMIN_DASHBOARD' },
            },
        }));
        return dispatch({ type: 'ENTER_LOGIN' });
    }

    store.setState((state) => ({
        ...state,
        ui: {
            ...state.ui,
            mode: 'ADMIN_DASHBOARD',
            status: 'READY',
            errorMessage: null,
            adminError: null,
        },
    }));
}
