const CASH_DEPOSIT_RATIO = 0.30;

export function ReservationPaymentsView({ viewState, handlers }) {
    const { payments, reservationId, reservation } = viewState;

    const container = document.createElement('div');
    container.className = 'max-w-3xl mx-auto py-10 px-6';

    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-8';

    const titleWrap = document.createElement('div');

    const title = document.createElement('h1');
    title.className = 'text-3xl font-bold text-slate-800';
    title.textContent = 'Zaplatit rezervaci';

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

    const hasPaidPayment = (payments ?? []).some((p) => p.status === 'PAID');

    if (hasPaidPayment) {
        container.appendChild(renderPaidInfo());
        container.appendChild(renderPaymentHistory(payments));
        return container;
    }

    const totalPrice = reservation?.totalPrice != null ? Number(reservation.totalPrice) : null;

    container.appendChild(renderPaymentForm({ totalPrice, handlers }));

    if ((payments ?? []).length > 0) {
        container.appendChild(renderPaymentHistory(payments));
    }

    return container;
}

function renderPaidInfo() {
    const box = document.createElement('div');
    box.className =
        'bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 flex items-center gap-4';

    const icon = document.createElement('div');
    icon.className = 'text-3xl';
    icon.textContent = '✅';

    const text = document.createElement('div');
    const heading = document.createElement('h2');
    heading.className = 'text-lg font-semibold text-green-800';
    heading.textContent = 'Rezervace je zaplacená';
    const note = document.createElement('p');
    note.className = 'text-sm text-green-700 mt-1';
    note.textContent = 'Další platba už není možná.';
    text.appendChild(heading);
    text.appendChild(note);

    box.appendChild(icon);
    box.appendChild(text);
    return box;
}

function renderPaymentForm({ totalPrice, handlers }) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6';

    const summary = document.createElement('div');
    summary.className = 'mb-6 pb-4 border-b border-slate-200';
    const summaryLabel = document.createElement('div');
    summaryLabel.className = 'text-sm text-slate-400';
    summaryLabel.textContent = 'Celková cena rezervace';
    const summaryValue = document.createElement('div');
    summaryValue.className = 'text-2xl font-semibold text-slate-800';
    summaryValue.textContent = totalPrice != null ? formatPrice(totalPrice) : '—';
    summary.appendChild(summaryLabel);
    summary.appendChild(summaryValue);
    card.appendChild(summary);

    const methodLabel = document.createElement('div');
    methodLabel.className = 'text-sm text-slate-500 mb-3';
    methodLabel.textContent = 'Vyberte způsob platby';
    card.appendChild(methodLabel);

    const methodsRow = document.createElement('div');
    methodsRow.className = 'grid grid-cols-2 gap-3 mb-6';

    const cardMethodBtn = createMethodButton('💳 Kartou', 'Platba celé částky');
    const cashMethodBtn = createMethodButton('💵 Hotovostí', 'Záloha 30 %, zbytek na recepci');

    const formArea = document.createElement('div');

    function selectMethod(method) {
        setMethodButtonActive(cardMethodBtn, method === 'CARD');
        setMethodButtonActive(cashMethodBtn, method === 'CASH');
        formArea.replaceChildren(renderMethodForm({ method, totalPrice, handlers }));
    }

    cardMethodBtn.addEventListener('click', () => selectMethod('CARD'));
    cashMethodBtn.addEventListener('click', () => selectMethod('CASH'));

    methodsRow.appendChild(cardMethodBtn);
    methodsRow.appendChild(cashMethodBtn);
    card.appendChild(methodsRow);
    card.appendChild(formArea);

    return card;
}

function createMethodButton(title, hint) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className =
        'text-left px-4 py-4 rounded-lg border-2 border-slate-200 hover:border-blue-400 transition-colors';
    const titleEl = document.createElement('div');
    titleEl.className = 'font-semibold text-slate-800';
    titleEl.textContent = title;
    const hintEl = document.createElement('div');
    hintEl.className = 'text-xs text-slate-500 mt-1';
    hintEl.textContent = hint;
    btn.appendChild(titleEl);
    btn.appendChild(hintEl);
    return btn;
}

function setMethodButtonActive(btn, active) {
    if (active) {
        btn.classList.remove('border-slate-200');
        btn.classList.add('border-blue-600', 'bg-blue-50');
    } else {
        btn.classList.remove('border-blue-600', 'bg-blue-50');
        btn.classList.add('border-slate-200');
    }
}

function renderMethodForm({ method, totalPrice, handlers }) {
    const wrap = document.createElement('div');

    const isCash = method === 'CASH';
    const amount = isCash && totalPrice != null
        ? totalPrice * CASH_DEPOSIT_RATIO
        : totalPrice;
    const amountLabelText = isCash ? 'K zaplacení (záloha 30 %)' : 'K zaplacení';
    const submitText = isCash ? 'Zaplatit zálohu' : 'Zaplatit';

    if (isCash) {
        const info = document.createElement('div');
        info.className =
            'px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900 mb-4';
        info.textContent =
            'Zaplatíte zálohu ve výši 30 % z celkové částky. Zbývajících 70 % uhradíte v hotovosti při příjezdu na recepci.';
        wrap.appendChild(info);
    }

    const form = document.createElement('form');
    form.className = 'grid gap-3';

    const cardNumber = createField({
        label: 'Číslo karty',
        placeholder: '1234 5678 9012 3456',
        maxLength: 19,
    });
    const cardHolder = createField({
        label: 'Jméno držitele',
        placeholder: 'JAN NOVAK',
    });

    const rowInline = document.createElement('div');
    rowInline.className = 'grid grid-cols-2 gap-3';
    const expiry = createField({ label: 'Platnost', placeholder: 'MM/RR', maxLength: 5 });
    const cvv = createField({ label: 'CVV', placeholder: '123', maxLength: 4 });
    rowInline.appendChild(expiry.wrap);
    rowInline.appendChild(cvv.wrap);

    form.appendChild(cardNumber.wrap);
    form.appendChild(cardHolder.wrap);
    form.appendChild(rowInline);

    const amountBox = document.createElement('div');
    amountBox.className =
        'mt-4 flex items-baseline justify-between px-4 py-3 rounded-lg bg-blue-50 border border-blue-100';
    const amountLabel = document.createElement('span');
    amountLabel.className = 'text-sm text-blue-800';
    amountLabel.textContent = amountLabelText;
    const amountValue = document.createElement('span');
    amountValue.className = 'text-xl font-semibold text-blue-900';
    amountValue.textContent = amount != null ? formatPrice(amount) : '—';
    amountBox.appendChild(amountLabel);
    amountBox.appendChild(amountValue);
    form.appendChild(amountBox);

    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.className =
        'mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors';
    submit.textContent = submitText;
    form.appendChild(submit);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!cardNumber.input.value || !cardHolder.input.value || !expiry.input.value || !cvv.input.value) {
            alert('Vyplňte prosím všechna pole karty.');
            return;
        }
        handlers.onCreatePayment(method);
    });

    wrap.appendChild(form);
    return wrap;
}

function createField({ label, placeholder, maxLength }) {
    const wrap = document.createElement('label');
    wrap.className = 'block';
    const labelEl = document.createElement('span');
    labelEl.className = 'block text-sm text-slate-500 mb-1';
    labelEl.textContent = label;
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholder ?? '';
    if (maxLength) input.maxLength = maxLength;
    input.className =
        'w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none';
    wrap.appendChild(labelEl);
    wrap.appendChild(input);
    return { wrap, input };
}

function renderPaymentHistory(payments) {
    const section = document.createElement('div');
    section.className = 'mt-8';

    const heading = document.createElement('h2');
    heading.className = 'text-lg font-semibold text-slate-700 mb-4';
    heading.textContent = 'Historie plateb';
    section.appendChild(heading);

    const list = document.createElement('div');
    list.className = 'grid gap-3';

    (payments ?? []).forEach((payment) => {
        const row = document.createElement('div');
        row.className =
            'bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between';

        const left = document.createElement('div');
        const amount = document.createElement('div');
        amount.className = 'font-semibold text-slate-800';
        amount.textContent = `${Number(payment.amount).toLocaleString('cs-CZ')} ${payment.currency || ''}`;
        const meta = document.createElement('div');
        meta.className = 'text-xs text-slate-500 mt-1';
        meta.textContent = `${payment.method || '—'} · ${payment.paidAt || payment.createdAt || '—'}`;
        left.appendChild(amount);
        left.appendChild(meta);

        const status = document.createElement('span');
        status.className =
            'px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100';
        status.textContent = payment.status || '—';

        row.appendChild(left);
        row.appendChild(status);
        list.appendChild(row);
    });

    section.appendChild(list);
    return section;
}

function formatPrice(value) {
    return `${Number(value).toLocaleString('cs-CZ')} Kč`;
}
