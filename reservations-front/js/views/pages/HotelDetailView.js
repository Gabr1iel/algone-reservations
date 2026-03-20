export function HotelDetailView({ viewState, handlers }) {
  const { hotel } = viewState;
  const container = document.createElement('div');

  // ── Back button ──
  const backBtn = document.createElement('button');
  backBtn.className =
    'flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mb-6 transition-colors';
  backBtn.innerHTML = '&larr; Zpět na seznam hotelů';
  backBtn.addEventListener('click', handlers.onGoBack);
  container.appendChild(backBtn);

  // ── Hotel header ──
  const header = document.createElement('div');
  header.className = 'mb-8';

  const name = document.createElement('h2');
  name.className = 'text-3xl font-bold text-slate-800 mb-2';
  name.textContent = hotel.name;

  const location = document.createElement('p');
  location.className = 'text-slate-500 text-lg';
  location.textContent = `${hotel.addressLine}, ${hotel.city} ${hotel.zip}, ${hotel.country}`;

  header.appendChild(name);
  header.appendChild(location);
  container.appendChild(header);

  // ── Info grid ──
  const grid = document.createElement('div');
  grid.className = 'grid md:grid-cols-2 gap-6 mb-8';

  // Description card
  if (hotel.description) {
    const descCard = createCard('Popis', hotel.description);
    descCard.className += ' md:col-span-2';
    grid.appendChild(descCard);
  }

  // Contact card
  const contactItems = [];
  if (hotel.email) contactItems.push({ label: 'E-mail', value: hotel.email });
  if (hotel.phone) contactItems.push({ label: 'Telefon', value: hotel.phone });

  if (contactItems.length > 0) {
    grid.appendChild(createInfoCard('Kontakt', contactItems));
  }

  // Check-in/out card
  const timeItems = [];
  if (hotel.checkInFrom) timeItems.push({ label: 'Check-in od', value: hotel.checkInFrom });
  if (hotel.checkOutUntil) timeItems.push({ label: 'Check-out do', value: hotel.checkOutUntil });

  if (timeItems.length > 0) {
    grid.appendChild(createInfoCard('Ubytování', timeItems));
  }

  container.appendChild(grid);

  return container;
}

function createCard(title, text) {
  const card = document.createElement('div');
  card.className = 'bg-white rounded-lg shadow-sm border border-slate-200 p-6';

  const heading = document.createElement('h3');
  heading.className = 'text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3';
  heading.textContent = title;

  const body = document.createElement('p');
  body.className = 'text-slate-700 leading-relaxed';
  body.textContent = text;

  card.appendChild(heading);
  card.appendChild(body);
  return card;
}

function createInfoCard(title, items) {
  const card = document.createElement('div');
  card.className = 'bg-white rounded-lg shadow-sm border border-slate-200 p-6';

  const heading = document.createElement('h3');
  heading.className = 'text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3';
  heading.textContent = title;
  card.appendChild(heading);

  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'flex justify-between py-2 border-b border-slate-100 last:border-0';

    const label = document.createElement('span');
    label.className = 'text-slate-500 text-sm';
    label.textContent = item.label;

    const value = document.createElement('span');
    value.className = 'text-slate-800 text-sm font-medium';
    value.textContent = item.value;

    row.appendChild(label);
    row.appendChild(value);
    card.appendChild(row);
  });

  return card;
}
