export async function submitRoom({ store, api, dispatch, payload }) {
    const { roomId, values } = payload ?? {};
    const token = store.getState().auth.token;
    const mode = store.getState().admin.roomFormMode;

    const error = validateRoom(values, mode);
    if (error) {
        store.setState((state) => ({
            ...state,
            ui: { ...state.ui, adminError: error },
        }));
        return;
    }

    const body = {
        roomTypeId: Number(values.roomTypeId),
        roomNumber: values.roomNumber.trim(),
        capacity: Number(values.capacity),
        pricePerNight: Number(values.pricePerNight),
        description: values.description?.trim() || null,
        isActive: Boolean(values.isActive),
        amenityIds: values.amenityIds ?? [],
    };

    const result = mode === 'EDIT'
        ? await api.put(`/admin/rooms/${roomId}`, body, token)
        : await api.post('/admin/rooms', { ...body, hotelId: Number(values.hotelId) }, token);

    if (result.status === 'SUCCESS') {
        window.location.hash = '#/admin/rooms';
        return dispatch({ type: 'ENTER_ADMIN_ROOMS' });
    }

    store.setState((state) => ({
        ...state,
        ui: { ...state.ui, adminError: result.reason || 'Nepodařilo se uložit pokoj.' },
    }));
}

function validateRoom(values, mode) {
    if (mode !== 'EDIT' && !values?.hotelId) return 'Vyberte hotel.';
    if (!values?.roomTypeId) return 'Vyberte typ pokoje.';
    if (!values?.roomNumber?.trim()) return 'Vyplňte číslo pokoje.';
    if (!Number(values?.capacity) || Number(values.capacity) <= 0) return 'Kapacita musí být kladné číslo.';
    if (!Number(values?.pricePerNight) || Number(values.pricePerNight) <= 0) return 'Cena za noc musí být kladná.';
    return null;
}
