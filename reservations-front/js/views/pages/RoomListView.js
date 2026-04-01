export function RoomListView({ viewState, handlers }) {
  const { rooms, hotelName, roomsLoading } = viewState;

  const container = document.createElement('div');

  // ── Záhlaví ──
  const header = document.createElement('div');
  header.className = 'mb-6';

  const title = document.createElement('h2');
  title.className = 'text-2xl font-bold text-slate-800';
  title.textContent = `Pokoje — ${hotelName}`;

  const subtitle = document.createElement('p');
  subtitle.className = 'text-sm text-slate-400 mt-1';
  subtitle.textContent = 'Nastavte filtry v postranním panelu a klikněte na Hledat.';

  header.appendChild(title);
  header.appendChild(subtitle);
  container.appendChild(header);

  // ── Stav načítání ──
  if (roomsLoading) {
    const loading = document.createElement('div');
    loading.className = 'flex items-center justify-center gap-3 text-slate-400 py-20';
    loading.textContent = 'Vyhledávám pokoje…';
    container.appendChild(loading);
    return container;
  }

  // ── Prázdný výsledek ──
  if (rooms.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'text-center py-20 text-slate-400';

    const emptyIcon = document.createElement('div');
    emptyIcon.className = 'text-5xl mb-4';
    emptyIcon.textContent = '🛏️';

    const emptyText = document.createElement('p');
    emptyText.className = 'text-lg font-medium';
    emptyText.textContent = 'Žádné pokoje neodpovídají zadaným filtrům.';

    const emptyHint = document.createElement('p');
    emptyHint.className = 'text-sm mt-2';
    emptyHint.textContent = 'Zkuste změnit nebo resetovat filtry.';

    empty.appendChild(emptyIcon);
    empty.appendChild(emptyText);
    empty.appendChild(emptyHint);
    container.appendChild(empty);
    return container;
  }

  // ── Počet výsledků ──
  const count = document.createElement('p');
  count.className = 'text-sm text-slate-500 mb-4';
  count.textContent = `Nalezeno ${rooms.length} ${rooms.length === 1 ? 'pokoj' : rooms.length < 5 ? 'pokoje' : 'pokojů'}`;
  container.appendChild(count);

  // ── Mřížka karet ──
  const grid = document.createElement('div');
  grid.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-6';

  rooms.forEach((room) => {
    grid.appendChild(createRoomCard(room, handlers));
  });

  container.appendChild(grid);
  return container;
}

function createRoomCard(room, handlers) {
  const card = document.createElement('div');
  card.className =
    'bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col';

  // ── Banner s typem pokoje ──
  const banner = document.createElement('div');
  banner.className =
    'h-28 bg-gradient-to-br from-blue-500 to-indigo-600 flex flex-col items-center justify-center text-white';

  const bannerIcon = document.createElement('span');
  bannerIcon.className = 'text-3xl mb-1';
  bannerIcon.textContent = '🛏️';

  const bannerType = document.createElement('span');
  bannerType.className = 'text-sm font-semibold tracking-wide';
  bannerType.textContent = room.roomTypeName;

  banner.appendChild(bannerIcon);
  banner.appendChild(bannerType);
  card.appendChild(banner);

  // ── Tělo karty ──
  const body = document.createElement('div');
  body.className = 'p-5 flex flex-col flex-1';

  // Číslo pokoje + cena
  const topRow = document.createElement('div');
  topRow.className = 'flex items-start justify-between mb-2';

  const roomNum = document.createElement('span');
  roomNum.className = 'text-lg font-bold text-slate-800';
  roomNum.textContent = `Pokoj ${room.roomNumber}`;

  const price = document.createElement('span');
  price.className = 'text-blue-600 font-bold text-sm text-right leading-tight';
  price.textContent = `${Number(room.pricePerNight).toLocaleString('cs-CZ')} Kč`;
  const priceNote = document.createElement('span');
  priceNote.className = 'block text-slate-400 text-xs font-normal';
  priceNote.textContent = 'za noc';
  price.appendChild(priceNote);

  topRow.appendChild(roomNum);
  topRow.appendChild(price);
  body.appendChild(topRow);

  // Kapacita
  const capacity = document.createElement('p');
  capacity.className = 'text-sm text-slate-500 mb-3';
  capacity.textContent = `Kapacita: ${room.capacity} ${capacityLabel(room.capacity)}`;
  body.appendChild(capacity);

  // Popis
  if (room.description) {
    const desc = document.createElement('p');
    desc.className = 'text-sm text-slate-500 mb-3 leading-relaxed line-clamp-2';
    desc.textContent = room.description;
    body.appendChild(desc);
  }

  // Amenity badges
  if (room.amenities?.length > 0) {
    const badges = document.createElement('div');
    badges.className = 'flex flex-wrap gap-1.5 mb-4';
    room.amenities.forEach((a) => {
      const badge = document.createElement('span');
      badge.className =
        'px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-100';
      badge.textContent = a.name;
      badges.appendChild(badge);
    });
    body.appendChild(badges);
  }

  // Tlačítko rezervovat (push na spodek karty)
  const spacer = document.createElement('div');
  spacer.className = 'flex-1';
  body.appendChild(spacer);

  const reserveBtn = document.createElement('button');
  reserveBtn.className =
    'w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors mt-2';
  reserveBtn.textContent = 'Rezervovat';
  reserveBtn.addEventListener('click', () => handlers.onReserveRoom(room.id));
  body.appendChild(reserveBtn);

  card.appendChild(body);
  return card;
}

function capacityLabel(n) {
  if (n === 1) return 'host';
  if (n < 5)   return 'hosté';
  return 'hostů';
}
