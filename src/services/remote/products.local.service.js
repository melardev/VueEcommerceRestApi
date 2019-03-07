import {NotificationService} from "@/services/local/notification.service";

export const ProductsLocalService = {
    fetchAll() {
        return new Promise((resolve, reject) => {
            NotificationService.showSuccessAlert('Products locally fetched successfully');
            const page_meta = {
                current_items_count: 12,
                current_page_number: 1,
                has_next_page: true,
                has_prev_page: false,
                next_page_number: 2,
                next_page_url: "/api/products?page_size=12&page=2",
                offset: 0,
                prev_page_number: 1,
                prev_page_url: "/api/products?page_size=12&page=1",
                requested_page_size: 12,
                total_items_count: 26,
                total_pages_count: 3,
            };
            const products = [
                {
                    name: "Demo 1",
                    price: 200,
                    slug: "demo-1",
                    stock: 10,
                },
                {
                    name: "Demo 2",
                    price: 200,
                    slug: "demo-2",
                    stock: 20,
                },
            ];
            resolve({success: true, page_meta, products});
        });
    }
};
