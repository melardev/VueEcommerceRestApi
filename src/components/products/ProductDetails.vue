<template>
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <img class="card-img-top" v-if="product.image_urls && product.image_urls.length > 0"
                     :src="product.image_urls instanceof Array && product.image_urls.length > 0 ? product.image_urls[0] : 'https://img.business.com/rc/816x500/aHR0cHM6Ly93d3cuYnVzaW5lc3NuZXdzZGFpbHkuY29tL2ltYWdlcy9pLzAwMC8wMTcvMDg0L29yaWdpbmFsL21hY2Jvb2stcHJvLTE4LnBuZw==?_ga=2.200130154.557404650.1551883694-765115885.1551883694'"
                     alt="">
            </div>

            <div class="col-md-6" v-if="product && product.slug">
                <hr/>
                <h3>{{product.name}}</h3>
                <hr/>
                <p>{{product.description}}</p>
                <hr/>
                <strong>Quantity</strong>
                <input class="form-control col-md-2" type="number" name="quantity"
                       value={this.state.quantity} min="1"
                       v-model="quantity"/>

                <h4>Price: $<strong>{{product.price.toFixed(2)}}</strong></h4>

                <button v-if="isProductInCart" class="btn btn-danger" @click="removeFromCart">
                    Remove from cart
                </button>
                &nbsp;
                <button class="btn btn-warning" @click="addProductToCart">
                    {{isProductInCart ? 'Update quantity' : 'Add to cart'}}
                </button>
                &nbsp;
                <router-link class="btn btn-success" to='/checkout'>
                    <i class="fa fa-shopping-cart"></i> Checkout
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import {ProductsAxiosService} from "@/services/remote/products.axios.service";
    import {NotificationService} from "@/services/local/notification.service";
    import {CartService} from "@/services/local/cart.service";
    import {stripResponse} from "@/utils/net.utils";

    export default {

        data() {
            return {
                product: {},
                quantity: 1,
                isProductInCart: false,
                cartItems: []
            }
        },
        mounted() {
            CartService.subscribe(this.onCartChanged);
            NotificationService.setIsLoading(true);
            ProductsAxiosService.fetchBySlug(this.$route.params.slug).then(res => {
                if (res.data && res.data.success) {
                    NotificationService.setIsLoading(false);
                    NotificationService.showSuccessAlert('Product loaded successfully');
                    this.product = stripResponse(res.data);
                }
            }).catch(err => {
                debugger;
                NotificationService.setIsLoading(false);
                NotificationService.showAlertError(err.message);
            });
        },

        methods: {
            onCartChanged(cartItems) {
                this.cartItems = cartItems;
                const cartItem = cartItems.find(ci => this.product.id === ci.id);
                if (cartItem) {
                    this.quantity = cartItem.quantity;
                    this.isProductInCart = true;
                } else {
                    this.isProductInCart = false;
                    this.quantity = 1;
                }
            },

            addProductToCart() {
                const quantity = parseInt(this.quantity);
                if (quantity <= 0)
                    return;
                CartService.addItem(this.product, quantity);
            },

            removeFromCart() {
                CartService.removeItem(this.product);
            },
        },
        watch: {
            product() { // this will be triggered each time this.product is changed, this is needed because
                // we always have to compare if the product is in cart or not, for that we need two info:
                // 1. products in cart 2. product loaded. The problem is that the product has to be fetched from a remote server.
                // so we will not have that info anytime soon, this is why we need to observe when we fetch the product, when we do,
                // we save the loaded product into this.product which triggers this watch and we make the check.
                const cartItem = this.cartItems.find(ci => this.product.id === ci.id);
                if (cartItem) {
                    debugger;
                    this.quantity = cartItem.quantity;
                    this.isProductInCart = true;
                } else {
                    this.isProductInCart = false;
                    this.quantity = 1;
                }
            }
        }
    };
</script>

<style scoped>
    .product-box {
        width: 800px;
        height: 400px;
        margin: 50px auto;
        box-sizing: border-box;
        padding: 1.5em;
        background-color: #fff;
        border-radius: 7px;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .product-image {
        width: 300px;
    }

    .product-info {
        width: 400px;
        align-self: flex-start;
    }

    .product-title {
        font-weight: normal;
    }

    .product-price {
        font-size: 2em;
        font-weight: bolder;
    }

    .product-box button {
        width: 300px;
        margin: .3em 0;
    }
</style>
