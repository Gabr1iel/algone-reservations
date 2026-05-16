export async function deleteUser({ store, api, dispatch, payload }) {
    const token = store.getState().auth.token;
    const userId = payload?.userId;

    if (!userId) {
        store.setState((state) => ({
            ...state,
            ui: { ...state.ui, adminError: 'Chybí identifikátor uživatele.' },
        }));
        return;
    }

    store.setState((state) => ({
        ...state,
        ui: { ...state.ui, isSubmitting: true, adminError: null },
    }));

    const result = await api.del(`/admin/users/${userId}`, token);

    if (result.status === 'SUCCESS') {
        store.setState((state) => ({
            ...state,
            ui: { ...state.ui, isSubmitting: false, notification: 'Uživatel byl smazán.' },
        }));
        return dispatch({ type: 'ENTER_ADMIN_USERS' });
    }

    const reason = result.reason?.includes('rezervace')
        ? 'Nelze smazat — uživatel má rezervace'
        : result.reason || 'Nepodařilo se smazat uživatele.';

    store.setState((state) => ({
        ...state,
        ui: { ...state.ui, isSubmitting: false, adminError: reason },
    }));
}
