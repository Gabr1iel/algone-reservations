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

  const returnAction = store.getState().ui.returnAction ?? { type: 'ENTER_HOTEL_LIST' };
  dispatch(returnAction);
}
