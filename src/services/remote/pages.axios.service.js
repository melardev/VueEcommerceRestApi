import {AxiosService} from "@/services/remote/base/axios.service";
import {NotificationService} from "@/services/local/notification.service";


export const PagesAxiosService = {
    fetchHome() {
        NotificationService.setIsLoading(true);
        return new Promise((resolve, reject) => {
            AxiosService.get('/').then(({data}) => {
                if (data.success) {
                    NotificationService.setIsLoading(false);
                    NotificationService.showSuccessAlert('Tags and Categories loaded successfully');
                } else {
                    NotificationService.showAlertError('Unknown Error');
                }

                resolve(data);
            }).catch(err => {
                debugger;
                NotificationService.setIsLoading(false);
                NotificationService.showToastError(err.message);
                reject(err);
            });

        })
    },
    getAbout() {

    }
};
