export async function registerSubmit({ store, api, dispatch, payload }) {
    const { firstName, lastName, email, password } = payload;

    store.setState((state) => ({
        ...state,
        ui: { ...state.ui, isSubmitting: true, registerError: null },
    }));

    const result = await api.post('/auth/register', { firstName, lastName, email, password });

    if (result.status !== 'SUCCESS') {
        store.setState((state) => ({
            ...state,
            ui: {
                ...state.ui,
                isSubmitting: false,
                registerError: result.reason ?? 'Registrace se nezdařila',
            },
        }));
        return;
    }

    store.setState((state) => ({
        ...state,
        auth: {
            role: result.role ?? 'USER',
            userId: result.userId ?? null,
            token: result.token,
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName,
        },
        ui: {
            ...state.ui,
            isSubmitting: false,
            registerError: null,
        },
    }));

    const returnAction = store.getState().ui.returnAction ?? { type: 'ENTER_HOTEL_LIST' };
    dispatch(returnAction);
}