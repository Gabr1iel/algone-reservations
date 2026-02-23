import { selectViewState } from '../selectors/selectors.js';
import { createHandlers } from '../handlers/createHandlers.js';

import { LoadingView } from './components/LoadingView.js';
import { ErrorView } from './components/ErrorView.js';
import { HotelListView } from './pages/HotelListView.js';

export function render(root, state, dispatch) {
  root.replaceChildren();

  const viewState = selectViewState(state);
  const handlers = createHandlers(dispatch, viewState);

  let view;

  switch (viewState.type) {
    case 'LOADING':
      view = LoadingView();
      break;

    case 'ERROR':
      view = ErrorView({ message: viewState.message, handlers });
      break;

    case 'HOTEL_LIST':
      view = HotelListView({ viewState, handlers });
      break;

    default:
      view = document.createTextNode(`Unknown view type: ${viewState.type}`);
  }

  root.appendChild(view);

  const { notification } = state.ui;
  if (notification) {
    const notificationElement = document.createElement('div');
    notificationElement.textContent = notification.message;
    notificationElement.classList.add('notification');
    root.appendChild(notificationElement);
  }
}
