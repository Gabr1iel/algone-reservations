export async function enterUserDetail({ store, apiClient }) {
    store.setState((state) => ({
        ...state,
        ui: {
            ...state.ui,
            mode: 'USER_DETAIL',
            status: 'LOADING',
            errorMessage: null,
        },
    }));

    try {
        const profile = await apiClient.get('/api/users/me');

        store.setState((state) => ({
            ...state,
            userProfile: profile,
            ui: {
                ...state.ui,
                mode: 'USER_DETAIL',
                status: 'READY',
                errorMessage: null,
            },
        }));
    } catch (error) {
        store.setState((state) => ({
            ...state,
            ui: {
                ...state.ui,
                mode: 'ERROR',
                status: 'READY',
                errorMessage: error?.message || 'Nepodařilo se načíst profil uživatele.',
            },
        }));
    }
}