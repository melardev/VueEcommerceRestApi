import {AxiosService} from "./base/axios.service";
import {NotificationService} from "@/services/local/notification.service";

export const ProductsAxiosService = {
    fetchAll(args) {
        NotificationService.setIsLoading(true);
        return new Promise((resolve, reject) => {
            AxiosService.fetchPage('products', args).then(response => {
                if (response.data.success) {
                    NotificationService.setIsLoading(false);
                    NotificationService.showSuccessAlert('Products Loaded fetched successfully');

                }

                resolve(response.data);
            }).catch(err => {
                debugger
                NotificationService.showToastError(err.message);
                reject(err);
            });
        });
    },

    //fetchAll(args)´{return AxiosService.fetchPage('products', args)},

    fetchBySlug(slug) {
        if (typeof slug !== "string") {
            throw new Error(
                "Slug must be a string"
            );
        }
        return AxiosService.get(`/products/${slug}`);
    },

};
