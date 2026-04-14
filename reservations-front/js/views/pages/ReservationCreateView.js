export function ReservationCreateView({ viewState, handlers }) {
    const { reservation } = viewState;

    const container = document.createElement('div');
    container.className = 'max-w-3xl mx-auto py-10 px-6';

    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-8';

    const titleWrap = document.createElement('div');

    const title = document.createElement('h1');
    title.className = 'text-3xl font-bold text-slate-800';
    title.textContent = 'Vytvoření rezervace';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-slate-500 mt-1';
    subtitle.textContent = 'Zkontrolujte vybraný pokoj a termín pobytu.';

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

    if (!reservation || !reservation.room) {
        const empty = document.createElement('div');
        empty.className = 'text-center py-20 text-slate-400';
        empty.textContent = 'Nepodařilo se načíst data o pokoji.';
        container.appendChild(empty);
        return container;
    }

    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl border border-slate-200 shadow-sm p-6';

    const roomTitle = document.createElement('h2');
    roomTitle.className = 'text-xl font-semibold text-slate-800 mb-2';
    roomTitle.textContent = `Pokoj ${reservation.room.roomNumber}`;

    const roomType = document.createElement('p');
    roomType.className = 'text-slate-500 mb-4';
    roomType.textContent = reservation.room.roomTypeName || 'Typ pokoje neuveden';

    const checkIn = document.createElement('p');
    checkIn.className = 'text-sm text-slate-600 mb-2';
    checkIn.textContent = `Příjezd: ${reservation.checkIn || '—'}`;

    const checkOut = document.createElement('p');
    checkOut.className = 'text-sm text-slate-600 mb-2';
    checkOut.textContent = `Odjezd: ${reservation.checkOut || '—'}`;

    const price = document.createElement('p');
    price.className = 'text-sm text-slate-600 mb-6';
    price.textContent = `Cena za noc: ${reservation.room.pricePerNight != null
        ? Number(reservation.room.pricePerNight).toLocaleString('cs-CZ') + ' Kč'
        : '—'}`;

    const info = document.createElement('div');
    info.className =
        'mb-6 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-700';
    info.textContent =
        'Další krok bude skutečné odeslání rezervace na backend. Teď je připravené UI flow.';

    const submitButton = document.createElement('button');
    submitButton.className =
        'w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors';
    submitButton.textContent = 'Potvrdit rezervaci';
    submitButton.addEventListener('click', handlers.onSubmitReservation);

    card.appendChild(roomTitle);
    card.appendChild(roomType);
    card.appendChild(checkIn);
    card.appendChild(checkOut);
    card.appendChild(price);
    card.appendChild(info);
    card.appendChild(submitButton);

    container.appendChild(card);
    return container;
}