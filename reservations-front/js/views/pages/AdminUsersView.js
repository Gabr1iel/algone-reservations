export function AdminUsersView({ viewState, handlers }) {
    const { users, currentUserId, adminError, isSubmitting } = viewState;

    const container = document.createElement('div');
    container.className = 'max-w-7xl mx-auto py-10 px-6';

    container.appendChild(createHeader('Uživatelé', 'Seznam registrovaných uživatelů.', handlers.onGoBack));

    if (adminError) {
        container.appendChild(createError(adminError));
    }

    const tableWrap = document.createElement('div');
    tableWrap.className = 'bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden';

    const table = document.createElement('table');
    table.className = 'w-full text-sm';

    const thead = document.createElement('thead');
    thead.className = 'bg-slate-50 border-b border-slate-200';
    const headRow = document.createElement('tr');
    ['ID', 'Email', 'Jméno', 'Příjmení', 'Role', 'Vytvořeno', 'Akce'].forEach((label) => {
        const th = document.createElement('th');
        th.className = 'text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide';
        th.textContent = label;
        headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    (users ?? []).forEach((user) => {
        const row = document.createElement('tr');
        row.className = 'border-b border-slate-100 hover:bg-slate-50';

        [user.id, user.email, user.firstName, user.lastName, user.role, formatDate(user.createdAt)].forEach((value) => {
            const td = document.createElement('td');
            td.className = 'px-4 py-3 text-slate-700';
            td.textContent = value ?? '—';
            row.appendChild(td);
        });

        const actions = document.createElement('td');
        actions.className = 'px-4 py-3';
        if (user.id !== currentUserId) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 rounded-lg';
            deleteButton.textContent = 'Smazat';
            deleteButton.disabled = isSubmitting;
            deleteButton.addEventListener('click', () => {
                showConfirmModal({
                    message: `Opravdu smazat uživatele ${user.email}?`,
                    onConfirm: () => handlers.onDeleteUser(user.id),
                });
            });
            actions.appendChild(deleteButton);
        } else {
            const self = document.createElement('span');
            self.className = 'text-xs text-slate-400';
            self.textContent = 'aktuální účet';
            actions.appendChild(self);
        }
        row.appendChild(actions);
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    container.appendChild(tableWrap);

    if (!users || users.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'text-center text-slate-400 py-10';
        empty.textContent = 'Žádní uživatelé.';
        tableWrap.appendChild(empty);
    }

    return container;
}

function createHeader(titleText, subtitleText, onGoBack) {
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-6';

    const titleWrap = document.createElement('div');
    const title = document.createElement('h1');
    title.className = 'text-3xl font-bold text-slate-800';
    title.textContent = titleText;
    const subtitle = document.createElement('p');
    subtitle.className = 'text-slate-500 mt-1';
    subtitle.textContent = subtitleText;
    titleWrap.appendChild(title);
    titleWrap.appendChild(subtitle);

    const back = document.createElement('button');
    back.className = 'bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300';
    back.textContent = 'Zpět na dashboard';
    back.addEventListener('click', onGoBack);

    header.appendChild(titleWrap);
    header.appendChild(back);
    return header;
}

function createError(message) {
    const box = document.createElement('div');
    box.className = 'mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg';
    box.textContent = message;
    return box;
}

function showConfirmModal({ message, onConfirm }) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center px-4';

    const modal = document.createElement('div');
    modal.className = 'w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6';

    const text = document.createElement('p');
    text.className = 'text-slate-700 mb-6';
    text.textContent = message;

    const actions = document.createElement('div');
    actions.className = 'flex justify-end gap-3';

    const cancel = document.createElement('button');
    cancel.className = 'px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300';
    cancel.textContent = 'Zrušit';
    cancel.addEventListener('click', () => overlay.remove());

    const confirm = document.createElement('button');
    confirm.className = 'px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700';
    confirm.textContent = 'Smazat';
    confirm.addEventListener('click', () => {
        overlay.remove();
        onConfirm();
    });

    actions.appendChild(cancel);
    actions.appendChild(confirm);
    modal.appendChild(text);
    modal.appendChild(actions);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

function formatDate(value) {
    return value ? String(value).replace('T', ' ').slice(0, 16) : '—';
}
