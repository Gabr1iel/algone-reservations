export function urlToRoute(url) {
  const hashIndex = url.indexOf('#');
  const path = hashIndex >= 0 ? url.slice(hashIndex + 1) : '';
  return parseUrl(path);
}

export function parseUrl(path) {
  const parts = path.split('/').filter(Boolean);

  if (parts.length === 1 && parts[0] === 'hotels') {
    return { context: 'HOTEL_LIST' };
  }

  if (parts.length === 1 && parts[0] === 'login') {
    return { context: 'LOGIN' };
  }

  if (parts.length === 1 && parts[0] === 'register') {
    return { context: 'REGISTER' };
  }

  if (parts.length === 3 && parts[0] === 'hotels' && parts[2] === 'rooms') {
    return { context: 'ROOM_LIST', hotelId: parts[1] };
  }

  if (parts.length === 2 && parts[0] === 'hotels') {
    return { context: 'HOTEL_DETAIL', hotelId: parts[1] };
  }

  return { context: 'UNKNOWN' };
}

export function routeToAction(route) {
  switch (route.context) {
    case 'HOTEL_LIST':
      return { type: 'ENTER_HOTEL_LIST' };
    case 'LOGIN':
      return { type: 'ENTER_LOGIN' };
    case 'REGISTER':
      return { type: 'ENTER_REGISTER' };
    case 'HOTEL_DETAIL':
      return { type: 'ENTER_HOTEL_DETAIL', payload: { hotelId: route.hotelId } };
    case 'ROOM_LIST':
      return { type: 'ENTER_ROOM_LIST', payload: { hotelId: route.hotelId } };
    case 'UNKNOWN':
      return { type: 'ENTER_HOTEL_LIST' };
  }
}

export function urlToAction(url) {
  const route = urlToRoute(url);
  return routeToAction(route);
}
