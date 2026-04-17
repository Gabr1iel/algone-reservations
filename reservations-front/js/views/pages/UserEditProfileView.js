export function UserEditProfileView({ viewState, handlers }) {
    const { user, isSubmitting, userEditError } = viewState;

    const container = document.createElement('div');
    container.className = 'max-w-xl mx-auto py-12 px-6';

    const title = document.createElement('h1');
    title.className = 'text-3xl font-bold text-slate-800 mb-2';
    title.textContent = 'Upravit profil';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-slate-500 mb-8';
    subtitle.textContent = 'Změňte své osobní údaje.';

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

    const form = document.createElement('form');
    form.className = 'flex flex-col gap-4';

    const firstName = createField({
        label: 'Jméno',
        type: 'text',
        value: user?.firstName ?? '',
        required: true,
    });
    const lastName = createField({
        label: 'Příjmení',
        type: 'text',
        value: user?.lastName ?? '',
        required: true,
    });
    const phone = createField({
        label: 'Telefon',
        type: 'tel',
        value: user?.phone ?? '',
    });

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.disabled = !!isSubmitting;
    submitBtn.className =
        'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded transition-colors mt-2';
    submitBtn.textContent = isSubmitting ? 'Ukládám…' : 'Uložit změny';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className =
        'text-sm text-slate-500 hover:text-slate-700 mt-2 block text-center w-full';
    cancelBtn.textContent = 'Zrušit';
    cancelBtn.addEventListener('click', handlers.onCancel);

    form.appendChild(firstName.wrap);
    form.appendChild(lastName.wrap);
    form.appendChild(phone.wrap);
    form.appendChild(submitBtn);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handlers.onSaveProfile({
            firstName: firstName.input.value.trim(),
            lastName: lastName.input.value.trim(),
            phone: phone.input.value.trim() || null,
        });
    });

    card.appendChild(form);
    card.appendChild(cancelBtn);
    container.appendChild(card);

    return container;
}

function createField({ label, type, value, required }) {
    const wrap = document.createElement('label');
    wrap.className = 'flex flex-col gap-1';
    const span = document.createElement('span');
    span.className = 'text-sm font-medium text-slate-700';
    span.textContent = label;
    wrap.appendChild(span);
    const input = document.createElement('input');
    input.type = type;
    input.value = value ?? '';
    if (required) input.required = true;
    input.className =
        'border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
    wrap.appendChild(input);
    return { wrap, input };
}
