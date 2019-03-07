import {AxiosService} from "./base/axios.service";
import {NotificationService} from "@/services/local/notification.service";
import {CartService} from "@/services/local/cart.service";

export const OrdersAxiosService = {

        fetchAll() {
            return new Promise((resolve, reject) => {
                AxiosService.get('/orders')
                    .then(response => {
                        if (response.data.success) {
                            NotificationService.setIsLoading(false);
                            NotificationService.showSuccessAlert('Orders loaded successfully');
                        }
                        resolve(response.data);
                    }).catch(err => {
                    NotificationService.setIsLoading(false);
                    NotificationService.showAlertError(err.message);
                    reject(err);
                });
            })

        },

        fetchOne(orderId) {
            return AxiosService.get(`/orders/${orderId}`);
        },

        checkoutWithNewAddress(cartItems, addressObj) {
            NotificationService.setIsLoading(true);
            return new Promise((resolve, reject) => {
                AxiosService.post('/orders', {
                    ...addressObj, cart_items: cartItems,
                }).then(res => {
                    NotificationService.setIsLoading(false);
                    NotificationService.showSuccessAlert('Order placed successfully');
                    CartService.emptyCart();
                    resolve(res.data);
                }).catch(err => {
                    NotificationService.showAlertError(err.message);
                    reject(err);
                });
            });
        },

        checkoutReusingAddress(cartItems, addressId) {
            NotificationService.setIsLoading(true);
            return new Promise((resolve, reject) => {
                AxiosService.post('/orders', {
                    address_id: addressId, cart_items: cartItems,
                }).then(res => {
                    NotificationService.setIsLoading(false);
                    NotificationService.showSuccessAlert('Order placed successfully');
                    CartService.emptyCart();
                    resolve(res.data);
                }).catch(err => {
                    NotificationService.setIsLoading(false);
                    NotificationService.showToastError(err.message);
                    reject(err);
                })
            });
        },
    }
;
