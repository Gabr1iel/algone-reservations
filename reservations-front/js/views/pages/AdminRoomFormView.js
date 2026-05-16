export function AdminRoomFormView({ viewState, handlers }) {
    const { mode, room, hotels, roomTypes, amenities, adminError } = viewState;
    const isEdit = mode === 'EDIT';

    const container = document.createElement('div');
    container.className = 'max-w-3xl mx-auto py-10 px-6';

    const title = document.createElement('h1');
    title.className = 'text-3xl font-bold text-slate-800 mb-2';
    title.textContent = isEdit ? 'Upravit pokoj' : 'Nový pokoj';
    container.appendChild(title);

    if (adminError) {
        const error = document.createElement('div');
        error.className = 'my-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg';
        error.textContent = adminError;
        container.appendChild(error);
    }

    const form = document.createElement('form');
    form.className = 'bg-white rounded-2xl border border-slate-200 shadow-sm p-6 grid gap-4';

    const hotelField = createSelectField('Hotel', 'hotelId', hotels ?? [], room?.hotelId);
    if (isEdit) {
        hotelField.select.disabled = true;
    }
    form.appendChild(hotelField.wrap);

    const typeField = createSelectField('Typ pokoje', 'roomTypeId', roomTypes ?? [], room?.roomTypeId);
    form.appendChild(typeField.wrap);

    const roomNumber = createInputField('Číslo pokoje', 'roomNumber', 'text', room?.roomNumber ?? '');
    const capacity = createInputField('Kapacita', 'capacity', 'number', room?.capacity ?? '');
    capacity.input.min = '1';
    const price = createInputField('Cena za noc', 'pricePerNight', 'number', room?.pricePerNight ?? '');
    price.input.min = '0.01';
    price.input.step = '0.01';
    form.appendChild(roomNumber.wrap);
    form.appendChild(capacity.wrap);
    form.appendChild(price.wrap);

    const description = document.createElement('label');
    description.className = 'block';
    const descriptionLabel = document.createElement('span');
    descriptionLabel.className = 'block text-sm text-slate-500 mb-1';
    descriptionLabel.textContent = 'Popis';
    const textarea = document.createElement('textarea');
    textarea.className = 'w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none min-h-28';
    textarea.value = room?.description ?? '';
    description.appendChild(descriptionLabel);
    description.appendChild(textarea);
    form.appendChild(description);

    const activeLabel = document.createElement('label');
    activeLabel.className = 'flex items-center gap-2 text-sm text-slate-700';
    const active = document.createElement('input');
    active.type = 'checkbox';
    active.checked = room?.isActive ?? true;
    activeLabel.appendChild(active);
    activeLabel.appendChild(document.createTextNode('Aktivní'));
    form.appendChild(activeLabel);

    const amenitiesWrap = document.createElement('div');
    const amenitiesTitle = document.createElement('div');
    amenitiesTitle.className = 'text-sm text-slate-500 mb-2';
    amenitiesTitle.textContent = 'Vybavení';
    amenitiesWrap.appendChild(amenitiesTitle);
    const selectedAmenityIds = new Set((room?.amenities ?? []).map((a) => String(a.id)));
    const amenitiesGrid = document.createElement('div');
    amenitiesGrid.className = 'grid md:grid-cols-2 gap-2';
    const amenityInputs = [];
    (amenities ?? []).forEach((amenity) => {
        const label = document.createElement('label');
        label.className = 'flex items-center gap-2 text-sm text-slate-700';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = amenity.id;
        checkbox.checked = selectedAmenityIds.has(String(amenity.id));
        amenityInputs.push(checkbox);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(amenity.name));
        amenitiesGrid.appendChild(label);
    });
    amenitiesWrap.appendChild(amenitiesGrid);
    form.appendChild(amenitiesWrap);

    const actions = document.createElement('div');
    actions.className = 'flex justify-end gap-3 pt-4';
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300';
    cancel.textContent = 'Zrušit';
    cancel.addEventListener('click', handlers.onCancel);
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.className = 'px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold';
    submit.textContent = 'Uložit';
    actions.appendChild(cancel);
    actions.appendChild(submit);
    form.appendChild(actions);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const values = {
            hotelId: hotelField.select.value,
            roomTypeId: typeField.select.value,
            roomNumber: roomNumber.input.value,
            capacity: capacity.input.value,
            pricePerNight: price.input.value,
            description: textarea.value,
            isActive: active.checked,
            amenityIds: amenityInputs.filter((input) => input.checked).map((input) => Number(input.value)),
        };
        handlers.onSubmitRoom({ roomId: room?.id, values });
    });

    container.appendChild(form);
    return container;
}

function createInputField(label, name, type, value) {
    const wrap = document.createElement('label');
    wrap.className = 'block';
    const labelEl = document.createElement('span');
    labelEl.className = 'block text-sm text-slate-500 mb-1';
    labelEl.textContent = label;
    const input = document.createElement('input');
    input.name = name;
    input.type = type;
    input.value = value;
    input.className = 'w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none';
    wrap.appendChild(labelEl);
    wrap.appendChild(input);
    return { wrap, input };
}

function createSelectField(label, name, items, selectedId) {
    const wrap = document.createElement('label');
    wrap.className = 'block';
    const labelEl = document.createElement('span');
    labelEl.className = 'block text-sm text-slate-500 mb-1';
    labelEl.textContent = label;
    const select = document.createElement('select');
    select.name = name;
    select.className = 'w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none';
    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = 'Vyberte';
    select.appendChild(empty);
    items.forEach((item) => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        option.selected = String(item.id) === String(selectedId);
        select.appendChild(option);
    });
    wrap.appendChild(labelEl);
    wrap.appendChild(select);
    return { wrap, select };
}
