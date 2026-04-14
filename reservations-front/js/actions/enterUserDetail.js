export async function enterUserDetail({ store, api }) {
    store.setState((state) => ({
        ...state,
        ui: {
            ...state.ui,
            mode: 'USER_DETAIL',
            status: 'LOADING',
            errorMessage: null,
        },
    }));

    const token = store.getState().auth.token;
    const result = await api.get('/users/me', token);

    if (result.status === 'SUCCESS') {
        store.setState((state) => ({
            ...state,
            userProfile: result.user ?? null,
            ui: {
                ...state.ui,
                mode: 'USER_DETAIL',
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
            errorMessage: result.reason || 'Nepodařilo se načíst profil uživatele.',
        },
    }));
}