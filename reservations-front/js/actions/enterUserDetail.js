export async function enterUserDetail({ store, api }) {
    const token = store.getState().auth.token;

    if (!token) {
        store.setState((state) => ({
            ...state,
            ui: {
                ...state.ui,
                mode: 'ERROR',
                status: 'ERROR',
                errorMessage: 'Pro zobrazení profilu se musíte nejdřív přihlásit.',
            },
        }));
        return;
    }

    store.setState((state) => ({
        ...state,
        ui: {
            ...state.ui,
            mode: 'USER_DETAIL',
            status: 'LOADING',
            errorMessage: null,
        },
    }));

    const result = await api.get('/users/me', token);

    if (result.status === 'SUCCESS') {
        const { status, ...user } = result;
        store.setState((state) => ({
            ...state,
            userProfile: user,
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