import { createInitialState } from './state/state.js';
import { createStore } from './infrastructure/createStore.js';
import { createDispatcher } from './dispatcher/dispatcher.js';
import { render } from './views/render.js';
import * as api from './infrastructure/apiClient.js';
import { urlToAction } from './router/router.js';

const store = createStore(createInitialState());
const dispatch = createDispatcher(store, api);

const root = document.getElementById('app');

store.subscribe((state) => render(root, state, dispatch));

dispatch({ type: 'APP_INIT' });

window.addEventListener('popstate', () => {
  const action = urlToAction(window.location.href);
  dispatch(action);
});
