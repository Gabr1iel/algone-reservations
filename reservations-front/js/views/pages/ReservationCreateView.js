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

    const room = reservation.room;
    const nights = computeNights(reservation.checkIn, reservation.checkOut);
    const pricePerNight = room.pricePerNight != null ? Number(room.pricePerNight) : null;
    const totalPrice = pricePerNight != null && nights > 0 ? pricePerNight * nights : null;

    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl border border-slate-200 shadow-sm p-6';

    const roomTitle = document.createElement('h2');
    roomTitle.className = 'text-2xl font-semibold text-slate-800 mb-1';
    roomTitle.textContent = `Pokoj ${room.roomNumber ?? '—'}`;

    const roomType = document.createElement('p');
    roomType.className = 'text-slate-500 mb-4';
    roomType.textContent = room.roomTypeName || 'Typ pokoje neuveden';

    card.appendChild(roomTitle);
    card.appendChild(roomType);

    if (room.description) {
        const description = document.createElement('p');
        description.className = 'text-sm text-slate-600 mb-4';
        description.textContent = room.description;
        card.appendChild(description);
    }

    const meta = document.createElement('div');
    meta.className = 'grid md:grid-cols-2 gap-3 text-sm text-slate-600 mb-6';

    const capacity = document.createElement('div');
    capacity.textContent = `Kapacita: ${room.capacity ?? '—'} osob`;
    meta.appendChild(capacity);

    const perNight = document.createElement('div');
    perNight.textContent = `Cena za noc: ${pricePerNight != null ? formatPrice(pricePerNight) : '—'}`;
    meta.appendChild(perNight);

    const checkInRow = document.createElement('div');
    checkInRow.textContent = `Příjezd: ${reservation.checkIn || '—'}`;
    meta.appendChild(checkInRow);

    const checkOutRow = document.createElement('div');
    checkOutRow.textContent = `Odjezd: ${reservation.checkOut || '—'}`;
    meta.appendChild(checkOutRow);

    const nightsRow = document.createElement('div');
    nightsRow.textContent = `Počet nocí: ${nights > 0 ? nights : '—'}`;
    meta.appendChild(nightsRow);

    card.appendChild(meta);

    if (Array.isArray(room.amenities) && room.amenities.length > 0) {
        const amenitiesLabel = document.createElement('div');
        amenitiesLabel.className = 'text-sm text-slate-400 mb-2';
        amenitiesLabel.textContent = 'Vybavení';
        card.appendChild(amenitiesLabel);

        const amenitiesList = document.createElement('div');
        amenitiesList.className = 'flex flex-wrap gap-2 mb-6';
        room.amenities.forEach((amenity) => {
            const chip = document.createElement('span');
            chip.className =
                'px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200';
            chip.textContent = amenity.name || amenity.code || '';
            amenitiesList.appendChild(chip);
        });
        card.appendChild(amenitiesList);
    }

    const totalBox = document.createElement('div');
    totalBox.className =
        'flex items-baseline justify-between mb-6 px-4 py-3 rounded-lg bg-blue-50 border border-blue-100';
    const totalLabel = document.createElement('span');
    totalLabel.className = 'text-sm text-blue-800';
    totalLabel.textContent = 'Celková cena';
    const totalValue = document.createElement('span');
    totalValue.className = 'text-xl font-semibold text-blue-900';
    totalValue.textContent = totalPrice != null ? formatPrice(totalPrice) : '—';
    totalBox.appendChild(totalLabel);
    totalBox.appendChild(totalValue);
    card.appendChild(totalBox);

    const submitButton = document.createElement('button');
    submitButton.className =
        'w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors';
    submitButton.textContent = 'Potvrdit rezervaci';
    submitButton.addEventListener('click', handlers.onSubmitReservation);
    card.appendChild(submitButton);

    container.appendChild(card);
    return container;
}

function computeNights(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.round(diff));
}

function formatPrice(value) {
    return `${Number(value).toLocaleString('cs-CZ')} Kč`;
}
