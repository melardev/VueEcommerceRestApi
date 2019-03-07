import {AxiosService} from "@/services/remote/base/axios.service";
import {AuthAxiosService} from "@/services/remote/auth-axios.service";
import {LocalStorageService} from "@/services/local/base/local-storage.service";
import {NotificationService} from "@/services/local/notification.service";

let observers = [];
const USER_KEY = 'user';

function notifyObservers(user) {
    // const cart = JSON.parse(StorageService.get(CART_KEY));
    observers.forEach(o => {
        o(user);
    });
}

const subscribe = (observer, receiveFirstState = true) => {
    // no more than one subscription
    if (!observers.includes(observer)) {
        observers.push(observer);
        if (receiveFirstState) {
            const user = JSON.parse(LocalStorageService.get(USER_KEY)) || {};
            observer(user);
        }
    }
};

const unsubscribe = (observer) => {
    const index = observers.indexOf(observer);
    if (index > -1)
        observers.splice(index, 1);
};
const login = (loginDto) => {
    NotificationService.setIsLoading(true);
    return new Promise((resolve, reject) => {
        AuthAxiosService.login(loginDto).then(res => {
            NotificationService.setIsLoading(false);
            if (res.data.success) {
                NotificationService.showSuccessAlert('Logged in successfully');
                const user = res.data.user;
                user.token = res.data.token;
                AxiosService.setUser(user);
                saveUser(user);
            }
            resolve(res.data);
        }).catch(err => {
            debugger
            NotificationService.setIsLoading(false);
            NotificationService.showToastError(err.message);
            reject(err);
        })
    });
};


const register = (userObject) => {
    NotificationService.setIsLoading(true);
    return new Promise((resolve, reject) => {
        AuthAxiosService.register(userObject).then(({data}) => {
            NotificationService.setIsLoading(false);
            NotificationService.showSuccessAlert('Registered successfully');
            resolve(data);
        }).catch(err => {
            NotificationService.showToastError(err.message);
            NotificationService.setIsLoading(false);
            reject(err);
        });
    });
};

const logout = () => {
    LocalStorageService.clear(USER_KEY);
    notifyObservers({});
};

const init = () => {
    const user = getUser();
    if (user && user.username) {
        AxiosService.setUser(user);
    }
    return user;
};
const getUser = () => {
    return JSON.parse(LocalStorageService.get(USER_KEY));
};

const saveUser = (user) => {
    LocalStorageService.set(USER_KEY, JSON.stringify(user));
    notifyObservers(user);
};
export const UsersService = {
    register, login, logout, init, getUser, subscribe, unsubscribe, saveUser
};
