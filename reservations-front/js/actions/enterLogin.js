export function enterLogin({ store }) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      mode: 'LOGIN',
      status: 'READY',
      loginError: null,
      isSubmitting: false,
    },
  }));
}
