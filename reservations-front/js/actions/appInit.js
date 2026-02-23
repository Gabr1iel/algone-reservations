import { urlToAction } from '../router/router.js';

export async function appInit({ store, api, dispatch }) {
  store.setState((state) => ({
    ...state,
    ui: { ...state.ui, status: 'LOADING', errorMessage: null },
  }));

  const result = await api.get('/hotels');

  if (result.status !== 'SUCCESS') {
    store.setState((state) => ({
      ...state,
      ui: { ...state.ui, status: 'ERROR', errorMessage: 'Nepodařilo se načíst data' },
    }));
    return;
  }

  store.setState((state) => ({
    ...state,
    hotels: result.hotels ?? [],
    ui: { ...state.ui, status: 'READY', errorMessage: null },
  }));

  const initialAction = urlToAction(window.location.href);
  dispatch(initialAction);
}
