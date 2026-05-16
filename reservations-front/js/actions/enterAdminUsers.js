export async function enterAdminUsers({ store, api, dispatch }) {
    const auth = store.getState().auth;

    if (auth.role !== 'ADMIN') {
        store.setState((state) => ({
            ...state,
            ui: { ...state.ui, returnAction: { type: 'ENTER_ADMIN_USERS' } },
        }));
        return dispatch({ type: 'ENTER_LOGIN' });
    }

    store.setState((state) => ({
        ...state,
        ui: { ...state.ui, mode: 'ADMIN_USERS', status: 'LOADING', adminError: null },
    }));

    const result = await api.get('/admin/users', auth.token);

    store.setState((state) => ({
        ...state,
        admin: {
            ...state.admin,
            users: result.status === 'SUCCESS' ? result.users ?? [] : state.admin.users,
        },
        ui: {
            ...state.ui,
            mode: 'ADMIN_USERS',
            status: 'READY',
            adminError: result.status === 'SUCCESS'
                ? null
                : result.reason || 'Nepodařilo se načíst uživatele.',
        },
    }));
}
