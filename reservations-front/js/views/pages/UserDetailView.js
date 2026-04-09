export function UserDetailView({ viewState, handlers }) {
    const { user } = viewState;

    const container = document.createElement('div');
    container.className = 'max-w-3xl mx-auto py-16 px-6';

    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-10';

    const titleWrap = document.createElement('div');

    const title = document.createElement('h1');
    title.className = 'text-3xl md:text-4xl font-bold text-slate-800 mb-2';
    title.textContent = 'Můj profil';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-slate-500';
    subtitle.textContent = 'Přehled údajů přihlášeného uživatele.';

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

    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl shadow-sm border border-slate-200 p-8';

    const fields = [
        { label: 'Jméno', value: user.firstName || '—' },
        { label: 'Příjmení', value: user.lastName || '—' },
        { label: 'Email', value: user.email || '—' },
        { label: 'Role', value: user.role || '—' },
        { label: 'Telefon', value: user.phone || '—' },
    ];

    fields.forEach((field) => {
        const row = document.createElement('div');
        row.className = 'py-4 border-b last:border-b-0 border-slate-200';

        const label = document.createElement('div');
        label.className = 'text-sm text-slate-400 mb-1';
        label.textContent = field.label;

        const value = document.createElement('div');
        value.className = 'text-lg text-slate-800 font-medium';
        value.textContent = field.value;

        row.appendChild(label);
        row.appendChild(value);
        card.appendChild(row);
    });

    container.appendChild(card);

    return container;
}