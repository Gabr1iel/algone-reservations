export async function updateProfile({ store, api, dispatch, payload }) {
    const token = store.getState().auth.token;

    if (!token) {
        return dispatch({ type: 'ENTER_LOGIN' });
    }

    store.setState((state) => ({
        ...state,
        ui: { ...state.ui, isSubmitting: true, userEditError: null },
    }));

    const result = await api.put('/users/me/profile', payload, token);

    if (result.status === 'SUCCESS') {
        const { status, ...user } = result;
        store.setState((state) => ({
            ...state,
            userProfile: user,
            auth: {
                ...state.auth,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            ui: {
                ...state.ui,
                isSubmitting: false,
                notification: 'Údaje byly úspěšně upraveny.',
                userEditError: null,
            },
        }));
        return dispatch({ type: 'ENTER_USER_DETAIL' });
    }

    store.setState((state) => ({
        ...state,
        ui: {
            ...state.ui,
            isSubmitting: false,
            userEditError: result.reason || 'Nepodařilo se upravit údaje.',
        },
    }));
}
