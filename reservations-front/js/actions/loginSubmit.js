export async function loginSubmit({ store, api, dispatch, payload }) {
  const { email, password } = payload;

  store.setState((state) => ({
    ...state,
    ui: { ...state.ui, isSubmitting: true, loginError: null },
  }));

  const result = await api.post('/auth/login', { email, password });

  if (result.status !== 'SUCCESS') {
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        isSubmitting: false,
        loginError: result.reason ?? 'Přihlášení se nezdařilo',
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
      loginError: null,
    },
  }));

  const returnAction = store.getState().ui.returnAction ?? { type: 'ENTER_HOTEL_LIST' };
  dispatch(returnAction);
}
