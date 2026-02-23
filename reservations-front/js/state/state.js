export function createInitialState() {
  return {
    hotels: [],

    auth: { role: 'ANONYMOUS', userId: null, token: null },

    ui: {
      mode: 'HOTEL_LIST',
      status: 'LOADING',
      errorMessage: null,
      notification: null,
    },
  };
}
