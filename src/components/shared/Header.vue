<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div class="container">
            <a class="navbar-brand" href="/">Vue Crud</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                    aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">Home
                            <span class="sr-only">(current)</span>
                        </router-link>
                    </li>

                    <li class="nav-item">
                        <router-link class="nav-link" to="/products">New Products
                            <span class="sr-only">(current)</span>
                        </router-link>
                    </li>

                    <li class="nav-item li-pointer" v-if="!isLoggedIn">
                        <router-link class="nav-link" to="/login" tag="li">Login</router-link>
                    </li>
                    <li class="nav-item li-pointer" v-if="!isLoggedIn">
                        <router-link class="nav-link" to="/register" tag="li">Register</router-link>
                    </li>

                    <li class="nav-item li-pointer" v-if="isLoggedIn">
                        <a @click="logout" class="nav-item nav-link li-pointer">Logout</a>
                    </li>

                    <li v-if="isLoggedIn" class="nav-item li-pointer">
                        <router-link to="/profile" v-if="isLoggedIn" class="nav-link">
                            <a>Profile</a>
                        </router-link>
                    </li>

                    <li>
                        <button class="btn btn-success navbar-btn btn-small" @click="togglePopupCart()">
                            <span class="badge">{{ numberOfItems }} Items ({{ totalPrice.toFixed(2) }} $)</span>
                            <i class="fa fa-shopping-cart"></i>
                        </button>
                        <transition name="appear">
                            <popup-cart class="cart" v-if="shouldShowCartDialog"/>
                        </transition>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

</template>

<script>

    import PopupCart from '../cart/PopupCart';
    import {CartService} from "@/services/local/cart.service";
    import {UsersService} from "@/services/local/users.service";

    export default {
        name: "Header",
        components: {
            popupCart: PopupCart
        },
        props: ['shouldShowCartDialog'],
        data() {
            return {
                isLoggedIn: false,
                currentUser: {},
                totalPrice: 0,
                cartItems: [],
                numberOfItems: 0,
            };
        },
        mounted() {
            UsersService.subscribe(this.onUserChanged);
            CartService.subscribe(this.onCartChanged);
        },
        methods: {
            onUserChanged(user) {
                if (user && user.username) {
                    this.isLoggedIn = true;
                    this.currentUser = user;
                } else {
                    this.isLoggedIn = false;
                    this.currentUser = {};
                }
            },
            onCartChanged(cartItems) {
                this.cartItems = cartItems;
                this.totalPrice = this.cartItems.reduce((accumulator, cartItem) => accumulator + cartItem.quantity * cartItem.price, 0);
                this.numberOfItems = this.cartItems.reduce((accumulator, cartItem) => accumulator + cartItem.quantity, 0);
            },

            logout() {
                UsersService.logout();
                if (this.$route.path.startsWith('/profile'))
                    this.$router.push('/');
            },

            togglePopupCart() {
                this.$emit('toggle-popup-cart');
            }
        }
    }
</script>

<style scoped>

</style>
