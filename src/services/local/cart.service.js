import {LocalStorageService} from "./base/local-storage.service";

const CART_KEY = 'cart';


let observers = [];

function notifyObservers(cart) {
    // const cart = JSON.parse(LocalStorageService.get(CART_KEY));
    observers.forEach(o => {
        o(cart);
    });
};

function subscribe(observer, receiveFirstState = true) {
    if (observers.indexOf(observer) === -1) {
        observers.push(observer);
        if (receiveFirstState) {
            const cart = JSON.parse(LocalStorageService.get('cart')) || [];
            observer(cart);
        }
    }
}

function unsubscribe(observer) {
    if (observers.includes(observer)) {
        observers = observers.filter(o => o !== observer);
    }
}

const numberOfUniqueItems = function () {
    if (typeof window !== 'undefined') {
        if (LocalStorageService.get()) {
            return JSON.parse(LocalStorageService.get('cart')).length
        }
    }
    return 0
};

/**
 * Adds an item or updates the quantity, if the cart item is in the cart, the new quantity will be
 * set to the given quantity param.
 * @param product
 * @param quantity
 * @returns {Array}
 */
function addItem(product, quantity) {
    let cartItems = JSON.parse(LocalStorageService.get(CART_KEY)) || [];
    let cartItem = cartItems.find(ci => ci.id === product.id);
    // If it will be a change then proceed to save and notify the observers
    if ((cartItem && cartItem.quantity !== quantity) || !cartItem) {
        if (cartItem && quantity > 0) {
            cartItem.quantity = quantity;
        } else if (cartItem && quantity <= 0) {
            return removeItem(cartItem);
        } else {

            /* Clone the product, then trip out what we do not need
            cartItem = Object.assign({}, product);
            delete cartItem.stock;
            delete cartItem.comments;
            delete cartItem.tags;
            delete cartItem.categories;
            */
            // or take what we need and build a new object
            const {id, name, slug, price, image_urls} = product;
            cartItem = {
                id, name, slug, price, quantity, image_urls
            };

            cartItems.push(cartItem);
        }
        localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
        notifyObservers(cartItems);
    }

    return cartItems;
}

function getCart() {
    if (typeof window !== "undefined") {
        if (LocalStorageService.get(CART_KEY)) {
            const cart = JSON.parse(LocalStorageService.get(CART_KEY));
            return cart;
        }
    }
    return []
}

function removeItem(product) {
    if (LocalStorageService.get(CART_KEY)) {
        let cartItems = JSON.parse(LocalStorageService.get(CART_KEY));

        /*
        const index = cartItems.findIndex(ci => ci.id === product.id);
        cartItems.splice(index, 1);
        */
        // or even better:
        cartItems = cartItems.filter(ci => ci.id !== product.id);
        LocalStorageService.set(CART_KEY, JSON.stringify(cartItems));
        notifyObservers(cartItems);
        return cartItems
    }
    // this should never happen actually
    debugger;
    return [];
}

function emptyCart() {
    LocalStorageService.remove(CART_KEY);
    notifyObservers([]);
}

export const CartService = {
    subscribe, unsubscribe, addItem, removeItem, emptyCart, getCart, numberOfUniqueItems
};
