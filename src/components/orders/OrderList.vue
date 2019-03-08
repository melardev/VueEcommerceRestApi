<template>
    <div class="container">
        <div class="row">
            <template v-if="this.orders.length > 0">
                <div :key=index v-for="(order,index) in this.orders">
                    <div :class="`${classNames[index%2]}`" style="max-width: '18rem;'">
                        <div class="card-header">{{order.tracking_number}}</div>
                        <div class="card-body">
                            <h5 class="card-title">{{order.order_status}}</h5>
                            <p class="card-text">{{order.total_price.toFixed(2)}}$ for {{order.order_items_count}}</p>
                        </div>
                    </div>
                </div>

            </template>
            <template v-else>
                You have no orders made yet
            </template>

        </div>
    </div>
</template>

<script>
    import {OrdersAxiosService} from "@/services/remote/orders.axios.service";
    import {NotificationService} from "@/services/local/notification.service";

    export default {
        name: "OrderList",
        data() {
            return {
                orders: [],
                classNames: ['card bg-light mb-3', 'card text-white bg-dark mb-3']
            }
        },
        mounted() {
            this.fetchOrders()
        },
        methods: {
            fetchOrders() {

                return OrdersAxiosService.fetchAll().then(data => {
                    if (data.success) {
                        NotificationService.setIsLoading(false);
                        this.page_meta = data.page_meta;
                        this.orders = data.orders;
                    }
                }).catch(err => {
                    NotificationService.setIsLoading(false);
                    NotificationService.showAlertError(err.message);
                });
            }
        },

    }
</script>

<style scoped>

</style>
