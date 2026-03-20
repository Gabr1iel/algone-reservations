export function Layout({ hotelName, auth, handlers, contentElement, fullWidth = false }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'min-h-screen flex flex-col';

  // ── Header ──
  const header = document.createElement('header');
  header.className = fullWidth
    ? 'bg-transparent absolute top-0 left-0 right-0 z-10'
    : 'bg-blue-700 text-white shadow-lg';

  const headerInner = document.createElement('div');
  headerInner.className = 'flex items-center justify-between px-6 py-4';

  const logo = document.createElement('h1');
  logo.className = 'text-xl font-bold tracking-wide';
  if (fullWidth) {
    logo.className += ' text-white drop-shadow-lg cursor-pointer';
    logo.addEventListener('click', () => handlers.onNavigate('HOTEL_LIST'));
  }
  logo.textContent = hotelName || 'Algone Reservations';

  const authSection = document.createElement('div');
  authSection.className = 'flex items-center gap-4';

  if (auth.role !== 'ANONYMOUS') {
    const userName = document.createElement('span');
    userName.className = fullWidth ? 'text-white/80 text-sm drop-shadow' : 'text-blue-100 text-sm';
    userName.textContent = `${auth.firstName} ${auth.lastName}`;
    authSection.appendChild(userName);

    const logoutBtn = document.createElement('button');
    logoutBtn.className = fullWidth
      ? 'bg-white/20 hover:bg-white/30 backdrop-blur text-white text-sm px-4 py-2 rounded transition-colors'
      : 'bg-blue-800 hover:bg-blue-900 text-white text-sm px-4 py-2 rounded transition-colors';
    logoutBtn.textContent = 'Odhlásit se';
    logoutBtn.addEventListener('click', handlers.onLogout);
    authSection.appendChild(logoutBtn);
  } else {
    const loginBtn = document.createElement('button');
    loginBtn.className = fullWidth
      ? 'bg-white/20 hover:bg-white/30 backdrop-blur text-white text-sm font-medium px-4 py-2 rounded transition-colors'
      : 'bg-white text-blue-700 hover:bg-blue-50 text-sm font-medium px-4 py-2 rounded transition-colors';
    loginBtn.textContent = 'Přihlásit se';
    loginBtn.addEventListener('click', handlers.onGoToLogin);
    authSection.appendChild(loginBtn);
  }

  headerInner.appendChild(logo);
  headerInner.appendChild(authSection);
  header.appendChild(headerInner);

  wrapper.appendChild(header);

  if (fullWidth) {
    // Full-width mode: no sidebar, content fills the page
    wrapper.appendChild(contentElement);
  } else {
    // ── Body (sidebar + main) ──
    const body = document.createElement('div');
    body.className = 'flex flex-1';

    // ── Sidebar ──
    const sidebar = document.createElement('aside');
    sidebar.className = 'w-56 bg-white border-r border-slate-200 shadow-sm';

    const nav = document.createElement('nav');
    nav.className = 'flex flex-col py-4';

    const navItems = [
      { label: 'Hotely', action: 'HOTEL_LIST', icon: '🏨' },
    ];

    if (auth.role !== 'ANONYMOUS') {
      navItems.push({ label: 'Moje rezervace', action: 'MY_RESERVATIONS', icon: '📋' });
    }

    if (auth.role === 'ADMIN') {
      navItems.push({ label: 'Správa', action: 'ADMIN_DASHBOARD', icon: '⚙️' });
    }

    navItems.forEach((item) => {
      const link = document.createElement('button');
      link.className =
        'flex items-center gap-3 px-6 py-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left';
      link.innerHTML = `<span>${item.icon}</span> ${item.label}`;
      link.addEventListener('click', () => handlers.onNavigate(item.action));
      nav.appendChild(link);
    });

    sidebar.appendChild(nav);

    // ── Main ──
    const main = document.createElement('main');
    main.className = 'flex-1 bg-slate-50 p-8';
    main.appendChild(contentElement);

    body.appendChild(sidebar);
    body.appendChild(main);
    wrapper.appendChild(body);
  }

  return wrapper;
}
