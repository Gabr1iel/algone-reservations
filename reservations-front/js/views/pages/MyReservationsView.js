export function MyReservationsView({ viewState, handlers }) {
    const { reservations } = viewState;

    const container = document.createElement('div');
    container.className = 'max-w-5xl mx-auto py-10 px-6';

    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-8';

    const titleWrap = document.createElement('div');

    const title = document.createElement('h1');
    title.className = 'text-3xl font-bold text-slate-800';
    title.textContent = 'Moje rezervace';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-slate-500 mt-1';
    subtitle.textContent = 'Přehled vašich aktuálních i minulých rezervací.';

    titleWrap.appendChild(title);
    titleWrap.appendChild(subtitle);

    const backButton = document.createElement('button');
    backButton.className =
        'bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors';
    backButton.textContent = 'Zpět';
    backButton.addEventListener('click', handlers.onGoBack);

    header.appendChild(titleWrap);
    header.appendChild(backButton);
    container.appendChild(header);

    if (!reservations || reservations.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'text-center py-20 text-slate-400';

        const icon = document.createElement('div');
        icon.className = 'text-5xl mb-4';
        icon.textContent = '📋';

        const text = document.createElement('p');
        text.className = 'text-lg font-medium';
        text.textContent = 'Zatím nemáte žádné rezervace.';

        empty.appendChild(icon);
        empty.appendChild(text);
        container.appendChild(empty);
        return container;
    }

    const list = document.createElement('div');
    list.className = 'grid gap-6';

    reservations.forEach((reservation) => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl border border-slate-200 shadow-sm p-6';

        const topRow = document.createElement('div');
        topRow.className = 'flex items-start justify-between gap-4 mb-4';

        const left = document.createElement('div');

        const hotel = document.createElement('h3');
        hotel.className = 'text-xl font-semibold text-slate-800';
        hotel.textContent = reservation.hotelName || 'Hotel';

        const room = document.createElement('p');
        room.className = 'text-sm text-slate-500 mt-1';
        room.textContent = `Pokoj ${reservation.roomNumber || '—'}`;

        left.appendChild(hotel);
        left.appendChild(room);

        const status = document.createElement('span');
        status.className =
            'px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100';
        status.textContent = reservation.status || '—';

        topRow.appendChild(left);
        topRow.appendChild(status);
        card.appendChild(topRow);

        const details = document.createElement('div');
        details.className = 'grid md:grid-cols-3 gap-4 text-sm text-slate-600';

        const checkIn = document.createElement('div');
        checkIn.textContent = `Příjezd: ${reservation.checkIn || '—'}`;

        const checkOut = document.createElement('div');
        checkOut.textContent = `Odjezd: ${reservation.checkOut || '—'}`;

        const price = document.createElement('div');
        price.textContent = `Cena: ${reservation.totalPrice != null ? Number(reservation.totalPrice).toLocaleString('cs-CZ') + ' Kč' : '—'}`;

        details.appendChild(checkIn);
        details.appendChild(checkOut);
        details.appendChild(price);
        card.appendChild(details);

        if (reservation.note) {
            const note = document.createElement('p');
            note.className = 'mt-4 text-sm text-slate-500';
            note.textContent = `Poznámka: ${reservation.note}`;
            card.appendChild(note);
        }

        const actions = document.createElement('div');
        actions.className = 'mt-6 flex justify-end gap-3';

        if (reservation.status === 'PENDING') {
            const payButton = document.createElement('button');
            payButton.className =
                'bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors';
            payButton.textContent = 'Zaplatit rezervaci';
            payButton.addEventListener('click', () =>
                handlers.onOpenPayments(reservation.id)
            );
            actions.appendChild(payButton);
        }

        if (reservation.status === 'PENDING' || reservation.status === 'CONFIRMED') {
            const cancelButton = document.createElement('button');
            cancelButton.className =
                'bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors';
            cancelButton.textContent = 'Zrušit rezervaci';
            cancelButton.addEventListener('click', () =>
                handlers.onCancelReservation(reservation.id)
            );
            actions.appendChild(cancelButton);
        }

        card.appendChild(actions);

        list.appendChild(card);
    });

    container.appendChild(list);
    return container;
}