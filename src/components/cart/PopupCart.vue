<template>
    <div class="box">
        <span v-if="!isCartEmpty">No products added yet</span>
        <div v-for="(cartItem, index) in cartItems" :key="index" class="box-item">
            <img :src="cartItem.image_urls instanceof Array && cartItem.image_urls.length > 0 ? cartItem.image_urls[0] : 'https://img.business.com/rc/816x500/aHR0cHM6Ly93d3cuYnVzaW5lc3NuZXdzZGFpbHkuY29tL2ltYWdlcy9pLzAwMC8wMTcvMDg0L29yaWdpbmFsL21hY2Jvb2stcHJvLTE4LnBuZw==?_ga=2.200130154.557404650.1551883694-765115885.1551883694'"
                 alt="" class="item-thumb">
            <h3 class="item-name">{{ cartItem.name }}</h3>
            <span class="item-amount">Quantity: {{cartItem.quantity}}</span>
            <span class="item-price">{{cartItem.quantity}} * {{ cartItem.price }}$</span>
        </div>
        <div class="cart-info" v-if="cartItems.length > 0">
            <span>Total: $ {{ totalPrice.toFixed(2) }}, 00</span>
            <router-link to="/cart">
                <button class="btn btn-small btn-info"
                        @click.native="showPopupCart()">
                    View cart
                </button>
            </router-link>
        </div>
    </div>
</template>

<script>

    import {CartService} from "@/services/local/cart.service";

    export default {
        data() {
            return {
                isCartEmpty: false,
                totalPrice: 0,
                cartItems: [],
            };
        },
        mounted() {
            CartService.subscribe(this.onCartChanged);
            this.totalPrice = this.cartItems.reduce((accumulator, cartItem) => accumulator + cartItem.quantity * cartItem.price,
                0 /* initial value*/);
        },
        methods: {
            showPopupCart() {
                debugger;
                throw Error();
            },
            onCartChanged(cartItems) {
                this.cartItems = cartItems;
                this.isCartEmpty = !!cartItems;
            }
        },
    };
</script>

<style scoped>
    .box {
        width: 400px;
        height: auto;
        background-color: #FAFAFA;
        box-shadow: 0px 0px 10px rgba(73, 74, 78, 0.1);
        border-radius: 5px;
        box-sizing: border-box;
        padding: 1em .5em;
        position: absolute;
        z-index: 1;
    }

    .box:after {
        content: '';
        width: 30px;
        height: 30px;
        transform: rotate(45deg);
        background: inherit;
        position: absolute;
        top: -15px;
        right: 15px;
    }

    .box-item {
        width: 100%;
        height: 130px;
        background-color: #fff;
        box-sizing: border-box;
        border-radius: 3px;
        padding: 0 .5em;
        margin-top: .3em;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
    }

    .item-thumb {
        max-width: 70%;
        grid-column: 1/2;
        grid-row: 1/4;
        align-self: center;
    }

    .item-name {
        grid-column: 2/4;
        grid-row: 1/2;
        font-weight: normal;
    }

    .item-amount {
        grid-column: 2/3;
        grid-row: 2/4;
        color: #ddd;
    }

    .cart-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

</style>
