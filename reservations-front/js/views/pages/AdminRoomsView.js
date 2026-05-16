export function AdminRoomsView({ viewState, handlers }) {
    const { rooms, hotels, hotelFilter, adminError } = viewState;

    const container = document.createElement('div');
    container.className = 'max-w-7xl mx-auto py-10 px-6';

    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-6';
    const titleWrap = document.createElement('div');
    const title = document.createElement('h1');
    title.className = 'text-3xl font-bold text-slate-800';
    title.textContent = 'Pokoje';
    const subtitle = document.createElement('p');
    subtitle.className = 'text-slate-500 mt-1';
    subtitle.textContent = 'Správa pokojů, cen a dostupnosti.';
    titleWrap.appendChild(title);
    titleWrap.appendChild(subtitle);

    const actions = document.createElement('div');
    actions.className = 'flex items-center gap-3';
    const newButton = document.createElement('button');
    newButton.className = 'bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg';
    newButton.textContent = 'Nový pokoj';
    newButton.addEventListener('click', () => {
        window.location.hash = '#/admin/rooms/new';
        handlers.onCreateRoom();
    });
    const backButton = document.createElement('button');
    backButton.className = 'bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300';
    backButton.textContent = 'Zpět';
    backButton.addEventListener('click', handlers.onGoBack);
    actions.appendChild(newButton);
    actions.appendChild(backButton);
    header.appendChild(titleWrap);
    header.appendChild(actions);
    container.appendChild(header);

    const filterBar = document.createElement('div');
    filterBar.className = 'flex items-center gap-3 mb-6 bg-white rounded-xl border border-slate-200 p-4';
    const filterLabel = document.createElement('label');
    filterLabel.className = 'text-sm font-medium text-slate-700';
    filterLabel.textContent = 'Hotel:';
    const select = document.createElement('select');
    select.className = 'px-3 py-2 border border-slate-300 rounded-lg text-sm';
    appendOption(select, 'ALL', 'Všechny hotely', hotelFilter);
    (hotels ?? []).forEach((hotel) => appendOption(select, String(hotel.id), hotel.name, String(hotelFilter)));
    select.addEventListener('change', (event) => handlers.onHotelFilterChange(event.target.value));
    filterBar.appendChild(filterLabel);
    filterBar.appendChild(select);
    container.appendChild(filterBar);

    if (adminError) {
        const error = document.createElement('div');
        error.className = 'mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg';
        error.textContent = adminError;
        container.appendChild(error);
    }

    const tableWrap = document.createElement('div');
    tableWrap.className = 'bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden';
    const table = document.createElement('table');
    table.className = 'w-full text-sm';
    const thead = document.createElement('thead');
    thead.className = 'bg-slate-50 border-b border-slate-200';
    const headRow = document.createElement('tr');
    ['Číslo', 'Typ', 'Kapacita', 'Cena/noc', 'Aktivní', 'Akce'].forEach((label) => {
        const th = document.createElement('th');
        th.className = 'text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide';
        th.textContent = label;
        headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    (rooms ?? []).forEach((room) => {
        const row = document.createElement('tr');
        row.className = 'border-b border-slate-100 hover:bg-slate-50';
        appendCell(row, room.roomNumber);
        appendCell(row, room.roomTypeName);
        appendCell(row, room.capacity);
        appendCell(row, formatPrice(room.pricePerNight));

        const activeCell = document.createElement('td');
        activeCell.className = 'px-4 py-3';
        const badge = document.createElement('span');
        badge.className = room.isActive
            ? 'inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200';
        badge.textContent = room.isActive ? 'Ano' : 'Ne';
        activeCell.appendChild(badge);
        row.appendChild(activeCell);

        const actionCell = document.createElement('td');
        actionCell.className = 'px-4 py-3 flex gap-2';
        const edit = document.createElement('button');
        edit.className = 'bg-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-300 text-xs font-semibold';
        edit.textContent = 'Upravit';
        edit.addEventListener('click', () => {
            window.location.hash = `#/admin/rooms/${room.id}/edit`;
            handlers.onEditRoom(room.id);
        });
        const toggle = document.createElement('button');
        toggle.className = 'bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-semibold';
        toggle.textContent = room.isActive ? 'Deaktivovat' : 'Aktivovat';
        toggle.addEventListener('click', () => handlers.onToggleActive(room.id, !room.isActive));
        actionCell.appendChild(edit);
        actionCell.appendChild(toggle);
        row.appendChild(actionCell);
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    container.appendChild(tableWrap);

    return container;
}

function appendOption(select, value, label, selectedValue) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    option.selected = value === selectedValue;
    select.appendChild(option);
}

function appendCell(row, value) {
    const td = document.createElement('td');
    td.className = 'px-4 py-3 text-slate-700';
    td.textContent = value ?? '—';
    row.appendChild(td);
}

function formatPrice(value) {
    return value != null ? `${Number(value).toLocaleString('cs-CZ')} Kč` : '—';
}
