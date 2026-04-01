import { selectViewState, selectLayoutData } from '../selectors/selectors.js';
import { createHandlers, createLayoutHandlers } from '../handlers/createHandlers.js';

import { Layout } from './components/Layout.js';
import { LoadingView } from './components/LoadingView.js';
import { ErrorView } from './components/ErrorView.js';
import { HotelListView } from './pages/HotelListView.js';
import { HotelDetailView } from './pages/HotelDetailView.js';
import { RoomListView } from './pages/RoomListView.js';
import { LoginView } from './pages/LoginView.js';
import { RegisterView } from './pages/RegisterView.js';
import { RoomFilterSidebar } from './components/RoomFilterSidebar.js';

export function render(root, state, dispatch) {
  root.replaceChildren();

  const viewState = selectViewState(state);
  const handlers = createHandlers(dispatch, viewState);
  const layoutData = selectLayoutData(state);
  const layoutHandlers = createLayoutHandlers(dispatch);

  let contentElement;
  let sidebarContent = null;

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
      sidebarContent = RoomFilterSidebar({
        viewState: {
          type: 'HOTEL_DETAIL',
          hotelName: viewState.hotel.name,
          hotelId: viewState.hotel.id,
          roomFilters: state.ui.roomFilters,
          availableRoomTypes: [],
          roomsLoading: false,
        },
        handlers,
      });
      break;

    case 'ROOM_LIST':
      contentElement = RoomListView({ viewState, handlers });
      sidebarContent = RoomFilterSidebar({ viewState, handlers });
      break;

    case 'LOGIN':
      contentElement = LoginView({ viewState, handlers });
      break;

    case 'REGISTER':
      contentElement = RegisterView({ viewState, handlers });
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
    sidebarContent,
  });

  root.appendChild(layout);
}
