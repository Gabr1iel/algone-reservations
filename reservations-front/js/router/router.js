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

  return { context: 'UNKNOWN' };
}

export function routeToAction(route) {
  switch (route.context) {
    case 'HOTEL_LIST':
      return { type: 'ENTER_HOTEL_LIST' };
    case 'UNKNOWN':
      return { type: 'ENTER_HOTEL_LIST' };
  }
}

export function urlToAction(url) {
  const route = urlToRoute(url);
  return routeToAction(route);
}
