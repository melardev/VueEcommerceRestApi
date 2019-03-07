<template>
    <div class="container">
        <div class="row">
            <template v-if="this.addresses.length > 0">
                <div :key=index v-for="(address,index) in this.addresses">
                    <div :class="`${classNames[index%2]}`" style="max-width: '18rem'">
                        <div class="card-header">{{address.first_name}} {{address.last_name}}</div>
                        <div class="card-body">
                            <h5 class="card-title">{{address.street_address}}</h5>
                            <p class="card-text">{{address.city}} {{address.country}}</p>
                        </div>
                    </div>
                </div>

            </template>
            <template v-else>
                You have no addresses added yet.Make an order to add a new one.
            </template>

        </div>
    </div>
</template>

<script>
    import {AddressesAxiosService} from "@/services/remote/addresses.axios.service";
    import {NotificationService} from "@/services/local/notification.service";

    export default {
        name: "AddressList",
        data() {
            return {
                classNames: ['card bg-light mb-3', 'card text-white bg-dark mb-3'],
                addresses: [],
                page_meta: {},
            }
        },
        mounted() {
            NotificationService.setIsLoading(true);
            return AddressesAxiosService.fetchAll().then(data => {
                NotificationService.setIsLoading(false);
                if (data.success) {
                    this.page_meta = data.page_meta;
                    this.addresses = data.addresses;
                }
            }).catch(err => {
                NotificationService.setIsLoading(false);
                NotificationService.showAlertError(err.message);
            });
        },

    }
</script>

<style scoped>

</style>
