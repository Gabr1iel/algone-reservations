export function ReservationPaymentsView({ viewState, handlers }) {
    const { payments, reservationId } = viewState;

    const container = document.createElement('div');
    container.className = 'max-w-5xl mx-auto py-10 px-6';

    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-8';

    const titleWrap = document.createElement('div');

    const title = document.createElement('h1');
    title.className = 'text-3xl font-bold text-slate-800';
    title.textContent = 'Platby k rezervaci';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-slate-500 mt-1';
    subtitle.textContent = `Rezervace #${reservationId ?? '—'}`;

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

    const actions = document.createElement('div');
    actions.className = 'mb-6 flex gap-3 flex-wrap';

    const methods = [
        { label: 'Zaplatit kartou', value: 'CARD' },
        { label: 'Bankovní převod', value: 'BANK_TRANSFER' },
        { label: 'Hotovost', value: 'CASH' },
    ];

    methods.forEach((method) => {
        const button = document.createElement('button');
        button.className =
            'bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors';
        button.textContent = method.label;
        button.addEventListener('click', () => handlers.onCreatePayment(method.value));
        actions.appendChild(button);
    });

    container.appendChild(actions);

    if (!payments || payments.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'text-center py-20 text-slate-400';

        const icon = document.createElement('div');
        icon.className = 'text-5xl mb-4';
        icon.textContent = '💳';

        const text = document.createElement('p');
        text.className = 'text-lg font-medium';
        text.textContent = 'K této rezervaci zatím nejsou žádné platby.';

        empty.appendChild(icon);
        empty.appendChild(text);
        container.appendChild(empty);
        return container;
    }

    const list = document.createElement('div');
    list.className = 'grid gap-6';

    payments.forEach((payment) => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl border border-slate-200 shadow-sm p-6';

        const topRow = document.createElement('div');
        topRow.className = 'flex items-start justify-between gap-4 mb-4';

        const left = document.createElement('div');

        const amount = document.createElement('h3');
        amount.className = 'text-xl font-semibold text-slate-800';
        amount.textContent = `${payment.amount != null ? Number(payment.amount).toLocaleString('cs-CZ') : '—'} ${payment.currency || ''}`;

        const method = document.createElement('p');
        method.className = 'text-sm text-slate-500 mt-1';
        method.textContent = `Metoda: ${payment.method || '—'}`;

        left.appendChild(amount);
        left.appendChild(method);

        const status = document.createElement('span');
        status.className =
            'px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100';
        status.textContent = payment.status || '—';

        topRow.appendChild(left);
        topRow.appendChild(status);
        card.appendChild(topRow);

        const details = document.createElement('div');
        details.className = 'grid md:grid-cols-3 gap-4 text-sm text-slate-600';

        const paidAt = document.createElement('div');
        paidAt.textContent = `Zaplaceno: ${payment.paidAt || '—'}`;

        const providerRef = document.createElement('div');
        providerRef.textContent = `Reference: ${payment.providerRef || '—'}`;

        const createdAt = document.createElement('div');
        createdAt.textContent = `Vytvořeno: ${payment.createdAt || '—'}`;

        details.appendChild(paidAt);
        details.appendChild(providerRef);
        details.appendChild(createdAt);
        card.appendChild(details);

        list.appendChild(card);
    });

    container.appendChild(list);
    return container;
}