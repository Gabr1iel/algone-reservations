export async function toggleRoomActive({ store, api, dispatch, payload }) {
    const token = store.getState().auth.token;
    const { roomId, active } = payload ?? {};

    if (!roomId) {
        store.setState((state) => ({
            ...state,
            ui: { ...state.ui, adminError: 'Chybí identifikátor pokoje.' },
        }));
        return;
    }

    const result = await api.patch(`/admin/rooms/${roomId}/active`, { active }, token);

    if (result.status === 'SUCCESS') {
        return dispatch({ type: 'ENTER_ADMIN_ROOMS' });
    }

    store.setState((state) => ({
        ...state,
        ui: { ...state.ui, adminError: result.reason || 'Nepodařilo se změnit aktivitu pokoje.' },
    }));
}
