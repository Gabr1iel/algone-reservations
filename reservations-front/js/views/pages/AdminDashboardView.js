export function AdminDashboardView({ viewState, handlers }) {
    const container = document.createElement('div');
    container.className = 'max-w-5xl mx-auto py-10 px-6';

    const title = document.createElement('h1');
    title.className = 'text-3xl font-bold text-slate-800 mb-2';
    title.textContent = 'Administrace';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-slate-500 mb-8';
    subtitle.textContent = 'Správa rezervací, uživatelů a pokojů.';

    container.appendChild(title);
    container.appendChild(subtitle);

    const grid = document.createElement('div');
    grid.className = 'grid md:grid-cols-3 gap-6';

    const tiles = [
        {
            label: 'Rezervace',
            description: 'Přehled všech rezervací a změna jejich stavu.',
            icon: '📋',
            target: 'ADMIN_RESERVATIONS',
            ready: true,
        },
        {
            label: 'Uživatelé',
            description: 'Seznam registrovaných uživatelů a jejich správa.',
            icon: '👥',
            target: 'ADMIN_USERS',
            ready: true,
        },
        {
            label: 'Pokoje',
            description: 'Správa pokojů, dostupnost a vybavení.',
            icon: '🛏️',
            target: 'ADMIN_ROOMS',
            ready: true,
        },
    ];

    tiles.forEach((tile) => {
        const card = document.createElement('button');
        card.className = tile.ready
            ? 'bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-left hover:border-blue-400 hover:shadow-md transition-all'
            : 'bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-left opacity-50 cursor-not-allowed';
        card.disabled = !tile.ready;

        if (tile.ready) {
            card.addEventListener('click', () => handlers.onNavigate(tile.target));
        }

        const icon = document.createElement('div');
        icon.className = 'text-4xl mb-3';
        icon.textContent = tile.icon;

        const tileTitle = document.createElement('h3');
        tileTitle.className = 'text-xl font-semibold text-slate-800 mb-1';
        tileTitle.textContent = tile.label;

        const tileDesc = document.createElement('p');
        tileDesc.className = 'text-sm text-slate-500';
        tileDesc.textContent = tile.ready ? tile.description : 'Připravuje se.';

        card.appendChild(icon);
        card.appendChild(tileTitle);
        card.appendChild(tileDesc);

        grid.appendChild(card);
    });

    container.appendChild(grid);
    return container;
}
