let observers = [];

const state = {
    is_loading: [],
    show_toast: false,
    show_alert: false,
    toast: {
        message: '',
        class_name: '',
    },
    alert: {
        message: '',
        class_name: '',
    },
};

function notifyObservers(message) {
    observers.forEach(o => {
        o(message);
    });
}

export const NotificationService = {
    subscribe(observer) {
        if (observers.indexOf(observer) === -1) {
            observers.push(observer);
        }
    },
    unsubscribe(observer) {
        if (observers.includes(observer)) {
            observers = observers.filter(o => o !== observer);
        }
    },

    setIsLoading(bool) {
        if (bool)
            state.is_loading = state.is_loading++;
        else
            state.is_loading = state.is_loading--;
    },

    showToastSuccess(message) {
        notifyObservers({show_toast: true, toast: {message, class_name: 'alert alert-success'}});
    },
    showToastError(message) {
        notifyObservers({show_toast: true, message, class_name: 'alert alert-danger'});
    },
    showSuccessAlert(message) {
        notifyObservers({show_alert: true, message, class_name: 'alert alert-success'});
    },

    showAlertError(message) {
        notifyObservers({show_alert: true, alert: {message, type: 'error'}});
    }

};
