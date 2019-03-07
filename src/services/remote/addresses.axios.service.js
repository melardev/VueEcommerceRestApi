import {AxiosService} from "@/services/remote/base/axios.service";
import {NotificationService} from "@/services/local/notification.service";

export const AddressesAxiosService = {

    fetchAll() {
        NotificationService.setIsLoading(true);
        return new Promise((resolve, reject) => {
            AxiosService.get('/addresses').then(res => {
                NotificationService.setIsLoading(false);
                if (res.data.success)
                    NotificationService.showSuccessAlert('Addresses loaded successfully');
                resolve(res.data);
            }).catch(err => {
                NotificationService.showToastError(err.message);
                NotificationService.setIsLoading(false);
                reject(err);
            });
        });
    },

    create() {
    }

};
