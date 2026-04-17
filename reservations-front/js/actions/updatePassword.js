export async function updatePassword({ store, api, dispatch, payload }) {
    const token = store.getState().auth.token;

    if (!token) {
        return dispatch({ type: 'ENTER_LOGIN' });
    }

    store.setState((state) => ({
        ...state,
        ui: { ...state.ui, isSubmitting: true, userEditError: null },
    }));

    const result = await api.put('/users/me/password', payload, token);

    if (result.status === 'SUCCESS') {
        store.setState((state) => ({
            ...state,
            ui: {
                ...state.ui,
                isSubmitting: false,
                notification: 'Heslo bylo úspěšně změněno.',
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
            userEditError: result.reason || 'Nepodařilo se změnit heslo.',
        },
    }));
}
