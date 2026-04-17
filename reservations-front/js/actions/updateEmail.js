export async function updateEmail({ store, api, dispatch, payload }) {
    const token = store.getState().auth.token;

    if (!token) {
        return dispatch({ type: 'ENTER_LOGIN' });
    }

    store.setState((state) => ({
        ...state,
        ui: { ...state.ui, isSubmitting: true, userEditError: null },
    }));

    const result = await api.put('/users/me/email', payload, token);

    if (result.status === 'SUCCESS') {
        store.setState((state) => ({
            ...state,
            userProfile: null,
            auth: {
                role: 'ANONYMOUS',
                userId: null,
                token: null,
                email: null,
                firstName: null,
                lastName: null,
            },
            ui: {
                ...state.ui,
                isSubmitting: false,
                notification: 'Email byl změněn. Přihlaste se novým emailem.',
                userEditError: null,
                returnAction: null,
            },
        }));
        return dispatch({ type: 'ENTER_LOGIN' });
    }

    store.setState((state) => ({
        ...state,
        ui: {
            ...state.ui,
            isSubmitting: false,
            userEditError: result.reason || 'Nepodařilo se změnit email.',
        },
    }));
}
