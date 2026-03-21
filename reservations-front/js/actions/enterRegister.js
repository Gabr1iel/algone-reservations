export function enterRegister({ store }) {
    store.setState((state) => ({
        ...state,
        ui: {
            ...state.ui,
            mode: 'REGISTER',
            status: 'READY',
            registerError: null,
            isSubmitting: false,
        },
    }));
}