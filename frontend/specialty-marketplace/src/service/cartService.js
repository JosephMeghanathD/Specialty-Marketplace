
const CART_KEY = 'specialtyCart';

const getCart = () => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : []; // Return empty array if no cart
};

const saveCart = (cartItems) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
};

const cartService = {
    addToCart: (product, quantity = 1) => {
        const cartItems = getCart();
        const existingItemIndex = cartItems.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
            cartItems[existingItemIndex].quantity += quantity;
        } else {
            cartItems.push({ ...product, quantity });
        }
        saveCart(cartItems);
        return cartItems; // Return updated cart
    },

    removeFromCart: (productId) => {
        let cartItems = getCart();
        cartItems = cartItems.filter(item => item.id !== productId);
        saveCart(cartItems);
        return cartItems;
    },

    updateQuantity: (productId, newQuantity) => {
        const cartItems = getCart();
        const itemIndex = cartItems.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            if (newQuantity <= 0) {
                // Remove item if quantity is 0 or less
                cartItems.splice(itemIndex, 1);
            } else {
                // Update quantity (consider stock limit later)
                cartItems[itemIndex].quantity = newQuantity;
            }
            saveCart(cartItems);
        }
        return cartItems;
    },

    getCartItems: () => {
        return getCart();
    },

    getItemCount: () => {
        const cartItems = getCart();
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    },

    getCartTotal: () => {
        const cartItems = getCart();
        return cartItems.reduce((total, item) => {
            const price = Number(item.price) || 0;
            const discount = Number(item.discount) || 0;
            const currentPrice = price * (1 - discount / 100);
            return total + (currentPrice * item.quantity);
        }, 0);
    },

    clearCart: () => {
        saveCart([]);
        return [];
    }
};

export default cartService;