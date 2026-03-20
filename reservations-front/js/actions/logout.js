export function logout({ store, dispatch }) {
  store.setState((state) => ({
    ...state,
    auth: {
      role: 'ANONYMOUS',
      userId: null,
      token: null,
      email: null,
      firstName: null,
      lastName: null,
    },
  }));

  dispatch({ type: 'ENTER_HOTEL_LIST' });
}
