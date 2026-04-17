export function enterUserEditProfile({ store }) {
    store.setState((state) => ({
        ...state,
        ui: {
            ...state.ui,
            mode: 'USER_EDIT_PROFILE',
            status: 'READY',
            errorMessage: null,
            userEditError: null,
        },
    }));
}
