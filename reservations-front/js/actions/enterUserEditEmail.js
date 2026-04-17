export function enterUserEditEmail({ store }) {
    store.setState((state) => ({
        ...state,
        ui: {
            ...state.ui,
            mode: 'USER_EDIT_EMAIL',
            status: 'READY',
            errorMessage: null,
            userEditError: null,
        },
    }));
}
