const STATUS_LABELS = {
    PENDING: 'Čekající',
    CONFIRMED: 'Potvrzená',
    CHECKED_IN: 'Ubytovaný',
    COMPLETED: 'Dokončená',
    CANCELLED: 'Zrušená',
};

const STATUS_BADGE_CLASS = {
    PENDING:    'bg-amber-50 text-amber-700 border-amber-200',
    CONFIRMED:  'bg-blue-50 text-blue-700 border-blue-200',
    CHECKED_IN: 'bg-violet-50 text-violet-700 border-violet-200',
    COMPLETED:  'bg-emerald-50 text-emerald-700 border-emerald-200',
    CANCELLED:  'bg-slate-100 text-slate-500 border-slate-200',
};

const ALLOWED_TRANSITIONS = {
    PENDING:    ['CONFIRMED', 'CANCELLED'],
    CONFIRMED:  ['CHECKED_IN', 'CANCELLED'],
    CHECKED_IN: ['COMPLETED', 'CANCELLED'],
    COMPLETED:  [],
    CANCELLED:  [],
};

export function AdminReservationsView({ viewState, handlers }) {
    const { reservations, statusFilter, adminError, isSubmitting } = viewState;

    const container = document.createElement('div');
    container.className = 'max-w-7xl mx-auto py-10 px-6';

    // Header
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-6';

    const titleWrap = document.createElement('div');
    const title = document.createElement('h1');
    title.className = 'text-3xl font-bold text-slate-800';
    title.textContent = 'Rezervace — administrace';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-slate-500 mt-1';
    subtitle.textContent = 'Přehled všech rezervací s možností změny stavu.';

    titleWrap.appendChild(title);
    titleWrap.appendChild(subtitle);

    const backButton = document.createElement('button');
    backButton.className =
        'bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors';
    backButton.textContent = 'Zpět na dashboard';
    backButton.addEventListener('click', handlers.onGoBack);

    header.appendChild(titleWrap);
    header.appendChild(backButton);
    container.appendChild(header);

    // Filter bar
    const filterBar = document.createElement('div');
    filterBar.className = 'flex items-center gap-3 mb-6 bg-white rounded-xl border border-slate-200 p-4';

    const filterLabel = document.createElement('label');
    filterLabel.className = 'text-sm font-medium text-slate-700';
    filterLabel.textContent = 'Filtr stavu:';

    const filterSelect = document.createElement('select');
    filterSelect.className =
        'px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

    const filterOptions = [
        { value: 'ALL', label: 'Vše' },
        ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
    ];

    filterOptions.forEach((opt) => {
        const optionEl = document.createElement('option');
        optionEl.value = opt.value;
        optionEl.textContent = opt.label;
        if (opt.value === statusFilter) {
            optionEl.selected = true;
        }
        filterSelect.appendChild(optionEl);
    });

    filterSelect.addEventListener('change', (e) => {
        handlers.onStatusFilterChange(e.target.value);
    });

    filterBar.appendChild(filterLabel);
    filterBar.appendChild(filterSelect);
    container.appendChild(filterBar);

    // Error
    if (adminError) {
        const errorBox = document.createElement('div');
        errorBox.className =
            'mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg';
        errorBox.textContent = adminError;
        container.appendChild(errorBox);
    }

    // Table or empty state
    if (!reservations || reservations.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'text-center py-20 text-slate-400';

        const emptyIcon = document.createElement('div');
        emptyIcon.className = 'text-5xl mb-4';
        emptyIcon.textContent = '📋';

        const emptyText = document.createElement('p');
        emptyText.className = 'text-lg font-medium';
        emptyText.textContent =
            statusFilter === 'ALL'
                ? 'Zatím žádné rezervace.'
                : `Žádné rezervace ve stavu „${STATUS_LABELS[statusFilter] ?? statusFilter}".`;

        empty.appendChild(emptyIcon);
        empty.appendChild(emptyText);
        container.appendChild(empty);
        return container;
    }

    const tableWrap = document.createElement('div');
    tableWrap.className = 'bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden';

    const table = document.createElement('table');
    table.className = 'w-full text-sm';

    const thead = document.createElement('thead');
    thead.className = 'bg-slate-50 border-b border-slate-200';
    const headerRow = document.createElement('tr');

    ['ID', 'Host', 'Hotel / Pokoj', 'Termín', 'Cena', 'Stav', 'Akce'].forEach((label) => {
        const th = document.createElement('th');
        th.className = 'text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide';
        th.textContent = label;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    reservations.forEach((r) => {
        const row = document.createElement('tr');
        row.className = 'border-b border-slate-100 hover:bg-slate-50 transition-colors';

        // ID
        const idCell = document.createElement('td');
        idCell.className = 'px-4 py-3 font-mono text-slate-700';
        idCell.textContent = `#${r.id}`;
        row.appendChild(idCell);

        // Guest
        const guestCell = document.createElement('td');
        guestCell.className = 'px-4 py-3';
        const guestName = document.createElement('div');
        guestName.className = 'font-medium text-slate-800';
        guestName.textContent = r.guestName || '—';
        const guestEmail = document.createElement('div');
        guestEmail.className = 'text-xs text-slate-500';
        guestEmail.textContent = r.guestEmail || '';
        guestCell.appendChild(guestName);
        guestCell.appendChild(guestEmail);
        row.appendChild(guestCell);

        // Hotel/Room
        const roomCell = document.createElement('td');
        roomCell.className = 'px-4 py-3';
        const hotelName = document.createElement('div');
        hotelName.className = 'font-medium text-slate-800';
        hotelName.textContent = r.hotelName || '—';
        const roomNumber = document.createElement('div');
        roomNumber.className = 'text-xs text-slate-500';
        roomNumber.textContent = `Pokoj ${r.roomNumber || '—'}`;
        roomCell.appendChild(hotelName);
        roomCell.appendChild(roomNumber);
        row.appendChild(roomCell);

        // Date range
        const dateCell = document.createElement('td');
        dateCell.className = 'px-4 py-3 text-slate-600';
        dateCell.textContent = `${r.checkIn || '—'} → ${r.checkOut || '—'}`;
        row.appendChild(dateCell);

        // Price
        const priceCell = document.createElement('td');
        priceCell.className = 'px-4 py-3 text-slate-700 font-medium';
        priceCell.textContent =
            r.totalPrice != null ? Number(r.totalPrice).toLocaleString('cs-CZ') + ' Kč' : '—';
        row.appendChild(priceCell);

        // Status badge
        const statusCell = document.createElement('td');
        statusCell.className = 'px-4 py-3';
        const statusBadge = document.createElement('span');
        const badgeClass = STATUS_BADGE_CLASS[r.status] || 'bg-slate-100 text-slate-600 border-slate-200';
        statusBadge.className = `inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClass}`;
        statusBadge.textContent = STATUS_LABELS[r.status] || r.status || '—';
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        // Action: change status
        const actionCell = document.createElement('td');
        actionCell.className = 'px-4 py-3';
        const allowed = ALLOWED_TRANSITIONS[r.status] || [];

        if (allowed.length === 0) {
            const noActions = document.createElement('span');
            noActions.className = 'text-xs text-slate-400 italic';
            noActions.textContent = 'koncový stav';
            actionCell.appendChild(noActions);
        } else {
            const select = document.createElement('select');
            select.className =
                'px-2 py-1 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500';
            select.disabled = isSubmitting;

            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.textContent = 'Změnit na…';
            select.appendChild(placeholder);

            allowed.forEach((target) => {
                const opt = document.createElement('option');
                opt.value = target;
                opt.textContent = STATUS_LABELS[target] || target;
                select.appendChild(opt);
            });

            select.addEventListener('change', (e) => {
                const target = e.target.value;
                if (!target) return;
                const ok = window.confirm(
                    `Opravdu změnit stav rezervace #${r.id} na „${STATUS_LABELS[target] || target}"?`
                );
                if (ok) {
                    handlers.onChangeStatus(r.id, target);
                } else {
                    e.target.value = '';
                }
            });

            actionCell.appendChild(select);
        }

        row.appendChild(actionCell);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableWrap.appendChild(table);
    container.appendChild(tableWrap);

    return container;
}
