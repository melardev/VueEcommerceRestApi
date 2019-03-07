import {SuperAgentService} from "./base/superagent.service";
import {NotificationService} from "@/services/local/notification.service";

export const ProductsSuperAgentService = {
    // fetchAll: (args) => SuperAgentService.fetchPage('/products', args),

    fetchAll(args){
        NotificationService.setIsLoading(true);
        return new Promise((resolve, reject) => {
            SuperAgentService.fetchPage('/products', args).then(response => {
                if (response.body.success) {
                    NotificationService.setIsLoading(false);
                    NotificationService.showSuccessAlert('Products Loaded fetched successfully');
                }
                resolve(response.body);
            }).catch(err => {
                debugger
                NotificationService.showToastError(err.message);
                reject(err);
            });
        });
    }
};
