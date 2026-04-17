export function UserEditEmailView({ viewState, handlers }) {
    const { currentEmail, isSubmitting, userEditError } = viewState;

    const container = document.createElement('div');
    container.className = 'max-w-xl mx-auto py-12 px-6';

    const title = document.createElement('h1');
    title.className = 'text-3xl font-bold text-slate-800 mb-2';
    title.textContent = 'Změnit email';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-slate-500 mb-8';
    subtitle.textContent = 'Po změně emailu budete odhlášeni a musíte se znovu přihlásit.';

    container.appendChild(title);
    container.appendChild(subtitle);

    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl shadow-sm border border-slate-200 p-8';

    if (userEditError) {
        const err = document.createElement('div');
        err.className =
            'bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-4';
        err.textContent = userEditError;
        card.appendChild(err);
    }

    const currentRow = document.createElement('div');
    currentRow.className = 'mb-4 text-sm text-slate-500';
    currentRow.textContent = `Aktuální email: ${currentEmail ?? '—'}`;
    card.appendChild(currentRow);

    const form = document.createElement('form');
    form.className = 'flex flex-col gap-4';

    const newEmail = createField({
        label: 'Nový email',
        type: 'email',
        placeholder: 'novy@email.cz',
        required: true,
    });
    const currentPassword = createField({
        label: 'Aktuální heslo',
        type: 'password',
        placeholder: '••••••••',
        required: true,
    });

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.disabled = !!isSubmitting;
    submitBtn.className =
        'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded transition-colors mt-2';
    submitBtn.textContent = isSubmitting ? 'Ukládám…' : 'Změnit email';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className =
        'text-sm text-slate-500 hover:text-slate-700 mt-2 block text-center w-full';
    cancelBtn.textContent = 'Zrušit';
    cancelBtn.addEventListener('click', handlers.onCancel);

    form.appendChild(newEmail.wrap);
    form.appendChild(currentPassword.wrap);
    form.appendChild(submitBtn);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handlers.onSaveEmail({
            newEmail: newEmail.input.value.trim(),
            currentPassword: currentPassword.input.value,
        });
    });

    card.appendChild(form);
    card.appendChild(cancelBtn);
    container.appendChild(card);

    return container;
}

function createField({ label, type, placeholder, required }) {
    const wrap = document.createElement('label');
    wrap.className = 'flex flex-col gap-1';
    const span = document.createElement('span');
    span.className = 'text-sm font-medium text-slate-700';
    span.textContent = label;
    wrap.appendChild(span);
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder ?? '';
    if (required) input.required = true;
    input.className =
        'border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
    wrap.appendChild(input);
    return { wrap, input };
}
