const AMENITY_OPTIONS = [
  { code: 'WIFI',      label: 'Wi-Fi' },
  { code: 'AC',        label: 'Klimatizace' },
  { code: 'PARKING',   label: 'Parkování' },
  { code: 'MINIBAR',   label: 'Minibar' },
  { code: 'BALCONY',   label: 'Balkón' },
  { code: 'TV',        label: 'TV' },
  { code: 'SAFE',      label: 'Trezor' },
  { code: 'HAIRDRYER', label: 'Fén' },
];

export function RoomFilterSidebar({ viewState, handlers }) {
  const { roomFilters, availableRoomTypes } = viewState;

  const sidebar = document.createElement('div');
  sidebar.className = 'flex flex-col h-full';

  // ── Záhlaví ──
  const header = document.createElement('div');
  header.className = 'px-5 py-4 border-b border-slate-200';

  const label = document.createElement('p');
  label.className = 'text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1';
  label.textContent = 'Filtrovat pokoje';

  const hotelName = document.createElement('p');
  hotelName.className = 'text-sm font-semibold text-slate-700 truncate';
  hotelName.textContent = viewState.hotelName || '';

  header.appendChild(label);
  header.appendChild(hotelName);
  sidebar.appendChild(header);

  // ── Tlačítko zpět (jen na stránce pokojů, ne na detailu hotelu) ──
  if (viewState.type === 'ROOM_LIST') {
    const backBtn = document.createElement('button');
    backBtn.className =
      'flex items-center gap-2 px-5 py-3 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors border-b border-slate-100 w-full text-left';
    backBtn.innerHTML = '&#8592; Zpět na hotel';
    backBtn.addEventListener('click', handlers.onGoBack);
    sidebar.appendChild(backBtn);
  }

  // ── Formulář ──
  const form = document.createElement('form');
  form.className = 'flex flex-col gap-4 px-5 py-4 overflow-y-auto flex-1';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const amenityCodes = AMENITY_OPTIONS
      .filter((opt) => form.querySelector(`[data-amenity="${opt.code}"]`)?.checked)
      .map((opt) => opt.code);

    handlers.onRoomSearch({
      checkIn:    form.querySelector('[name="checkIn"]').value,
      checkOut:   form.querySelector('[name="checkOut"]').value,
      capacity:   Number(form.querySelector('[name="capacity"]').value),
      maxPrice:   form.querySelector('[name="maxPrice"]').value,
      roomTypeId: Number(form.querySelector('[name="roomTypeId"]').value),
      amenityCodes,
    });
  });

  // Datum příjezdu
  form.appendChild(createField('Datum příjezdu', createDateInput('checkIn', roomFilters.checkIn)));
  // Datum odjezdu
  form.appendChild(createField('Datum odjezdu', createDateInput('checkOut', roomFilters.checkOut)));

  // Počet hostů
  const capacitySelect = document.createElement('select');
  capacitySelect.name = 'capacity';
  capacitySelect.className = inputCls();
  [['0', 'Libovolný počet'], ['1', '1 host'], ['2', '2 hosté'], ['3', '3 hosté'], ['4', '4+ hosté']]
    .forEach(([val, lbl]) => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = lbl;
      opt.selected = String(roomFilters.capacity) === val;
      capacitySelect.appendChild(opt);
    });
  form.appendChild(createField('Počet hostů', capacitySelect));

  // Typ pokoje
  const typeSelect = document.createElement('select');
  typeSelect.name = 'roomTypeId';
  typeSelect.className = inputCls();
  const anyOpt = document.createElement('option');
  anyOpt.value = '0';
  anyOpt.textContent = 'Všechny typy';
  typeSelect.appendChild(anyOpt);
  availableRoomTypes.forEach((rt) => {
    const opt = document.createElement('option');
    opt.value = String(rt.id);
    opt.textContent = rt.name;
    opt.selected = roomFilters.roomTypeId === rt.id;
    typeSelect.appendChild(opt);
  });
  form.appendChild(createField('Typ pokoje', typeSelect));

  // Max. cena za noc
  const priceInput = document.createElement('input');
  priceInput.type = 'number';
  priceInput.name = 'maxPrice';
  priceInput.value = roomFilters.maxPrice ?? '';
  priceInput.placeholder = 'Bez omezení';
  priceInput.min = '0';
  priceInput.className = inputCls();
  form.appendChild(createField('Max. cena za noc (Kč)', priceInput));

  // Vybavení — checkboxy
  const amenityGroup = document.createElement('div');
  const amenityLabel = document.createElement('p');
  amenityLabel.className = 'text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2';
  amenityLabel.textContent = 'Vybavení';
  amenityGroup.appendChild(amenityLabel);

  AMENITY_OPTIONS.forEach((opt) => {
    const row = document.createElement('label');
    row.className = 'flex items-center gap-2 text-sm text-slate-600 cursor-pointer py-0.5';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.amenity = opt.code;
    checkbox.className = 'rounded border-slate-300 text-blue-600';
    checkbox.checked = roomFilters.amenityCodes.includes(opt.code);

    row.appendChild(checkbox);
    row.appendChild(document.createTextNode(opt.label));
    amenityGroup.appendChild(row);
  });
  form.appendChild(amenityGroup);

  // Tlačítko hledat
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className =
    'w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2';
  submitBtn.textContent = 'Hledat';
  form.appendChild(submitBtn);

  sidebar.appendChild(form);
  return sidebar;
}

function inputCls() {
  return 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500';
}

function createDateInput(name, value) {
  const input = document.createElement('input');
  input.type = 'date';
  input.name = name;
  input.value = value ?? '';
  input.className = inputCls();
  return input;
}

function createField(labelText, inputEl) {
  const wrapper = document.createElement('div');
  const lbl = document.createElement('label');
  lbl.className = 'text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1';
  lbl.textContent = labelText;
  wrapper.appendChild(lbl);
  wrapper.appendChild(inputEl);
  return wrapper;
}
