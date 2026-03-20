import { selectViewState, selectLayoutData } from '../selectors/selectors.js';
import { createHandlers, createLayoutHandlers } from '../handlers/createHandlers.js';

import { Layout } from './components/Layout.js';
import { LoadingView } from './components/LoadingView.js';
import { ErrorView } from './components/ErrorView.js';
import { HotelListView } from './pages/HotelListView.js';
import { HotelDetailView } from './pages/HotelDetailView.js';
import { LoginView } from './pages/LoginView.js';

export function render(root, state, dispatch) {
  root.replaceChildren();

  const viewState = selectViewState(state);
  const handlers = createHandlers(dispatch, viewState);
  const layoutData = selectLayoutData(state);
  const layoutHandlers = createLayoutHandlers(dispatch);

  let contentElement;

  switch (viewState.type) {
    case 'LOADING':
      contentElement = LoadingView();
      break;

    case 'ERROR':
      contentElement = ErrorView({ message: viewState.message, handlers });
      break;

    case 'HOTEL_LIST':
      contentElement = HotelListView({ viewState, handlers });
      break;

    case 'HOTEL_DETAIL':
      contentElement = HotelDetailView({ viewState, handlers });
      break;

    case 'LOGIN':
      contentElement = LoginView({ viewState, handlers });
      break;

    default:
      contentElement = document.createTextNode(`Unknown view type: ${viewState.type}`);
  }

  const isFullWidth = state.ui.mode === 'HOTEL_LIST';

  const layout = Layout({
    hotelName: layoutData.hotelName,
    auth: layoutData.auth,
    handlers: layoutHandlers,
    contentElement,
    fullWidth: isFullWidth,
  });

  root.appendChild(layout);
}
