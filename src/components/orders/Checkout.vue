<template>
    <div class="card text-center shadow-lg p-3 mb-5 bg-white rounded page-hero d-flex align-items-center justify-content-center">
        <div class="card-body">
            <div class="form-group col-md-12" v-if="isLoggedIn">
                <label>
                    <select v-on:change="onAddressChanged">
                        <option key="-1" value="-1">Not selected</option>

                        <option :key="index" :value="address.id" v-for="(address,index) in this.addresses">
                            {{address.street_address}}/{{address.country}}/{{address.city}}/{{address.zip_code}}
                        </option>
                    </select>
                </label>
            </div>

            <div class="form-group">

                <label>First Name
                    <input type="text" name="first_name" class="form-control"
                           v-model="mutable_address.first_name"/>
                </label>
            </div>

            <div class="form-group">

                <label>Last Name:
                    <input type="text" name=" last_name" class="form-control"
                           v-model="mutable_address.last_name"/>
                </label>
            </div>

            <div class=" form-group">
                <div><strong>Street Address</strong></div>

                <label>
                    <input type=" text" name=" address" class=" form-control"
                           v-model="mutable_address.street_address"/>
                </label>

            </div>
            <div class=" form-group">
                <div><strong>City:</strong></div>
                <div>
                    <label>
                        <input type=" text" name=" city" class="form-control"
                               v-model="mutable_address.city"/>
                    </label>
                </div>
            </div>
            <div class="form-group">
                <label> Country:
                    <input type="text" name=" state" class=" form-control"
                           v-model="mutable_address.country"/>
                </label>

            </div>
            <div class=" form-group">

                <label>Zip / Postal Code
                    <input type="text" name=" zip_code" class=" form-control"
                           v-model="mutable_address.zip_code"/>
                </label>
            </div>
        </div>
        <div class="row card-footer">
            <button type="button" class="btn btn-primary"
                    v-on:click="placeOrder">Place Order
            </button>
        </div>
    </div>

</template>

<script>

    import {NotificationService} from "@/services/local/notification.service";
    import {AddressesAxiosService} from "@/services/remote/addresses.axios.service";
    import {UsersService} from "@/services/local/users.service";
    import {CartService} from "@/services/local/cart.service";
    import {OrdersAxiosService} from "@/services/remote/orders.axios.service";

    const defaultAddress = {
        id: -1,
        first_name: '',
        last_name: '',
        street_address: '',
        city: '',
        country: '',
        zip_code: ''
    };

    export default {
        name: "Checkout",
        data() {
            return {
                selected_address: {...defaultAddress},
                mutable_address: {...defaultAddress},
                isLoggedIn: false,
                cartItems: [],
                addresses: [],
            };
        },

        mounted() {
            UsersService.subscribe(this.onUserChanged);
            CartService.subscribe(this.onCartChanged);

            if (this.isLoggedIn) {
                return AddressesAxiosService.fetchAll().then(data => {

                    if (data.success) {
                        this.page_meta = data.page_meta;
                        this.addresses = data.addresses;
                    }
                }).catch(err => {
                    NotificationService.setIsLoading(false);
                    NotificationService.showAlertError(err.message);
                });
            }
        },

        methods: {
            onUserChanged(user) {
                if (user && user.username) {
                    this.isLoggedIn = true;
                }
            },
            placeOrder: function () {
                let promise;
                if (this.isLoggedIn &&
                    this.mutable_address.first_name !== '' && // make sure at least one non empty field
                    JSON.stringify(this.selected_address) === JSON.stringify(this.mutable_address)) {
                    promise = OrdersAxiosService.checkoutReusingAddress(this.cartItems,
                        this.selected_address.id
                    )
                } else {
                    promise = OrdersAxiosService.checkoutWithNewAddress(this.cartItems, this.mutable_address);
                }

                promise.then(res => {
                    if (res.success)
                        this.$router.push('/');
                }).catch(err => {
                    debugger;
                })
            },
            onAddressChanged: function (evt) {
                const addressId = parseInt(evt.target.value); // Get Id of selected address Id
                if (addressId === -1) {
                    this.mutable_address = defaultAddress;
                    this.selected_address = defaultAddress
                } else {
                    const address = this.addresses.find(address => address.id === addressId);
                    this.selected_address = address;
                    this.mutable_address = {...address};
                }
            },

            onCartChanged(cartItems) {
                this.cartItems = cartItems;
            }
        },
    }
</script>

<style scoped>

</style>
