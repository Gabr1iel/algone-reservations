export function enterUserEditPassword({ store }) {
    store.setState((state) => ({
        ...state,
        ui: {
            ...state.ui,
            mode: 'USER_EDIT_PASSWORD',
            status: 'READY',
            errorMessage: null,
            userEditError: null,
        },
    }));
}
