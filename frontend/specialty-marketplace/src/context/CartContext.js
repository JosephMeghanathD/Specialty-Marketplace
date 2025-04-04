import React, { createContext, useState, useEffect, useContext } from 'react';
import cartService from '../service/cartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(cartService.getCartItems());
    const [itemCount, setItemCount] = useState(cartService.getItemCount());
    const [cartTotal, setCartTotal] = useState(cartService.getCartTotal());

    useEffect(() => {
        setItemCount(cartService.getItemCount());
        setCartTotal(cartService.getCartTotal());
    }, [cartItems]);

    const addItem = (product, quantity = 1) => {
        const productToAdd = {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            discount: product.discount,
            stockQuantity: product.stockQuantity
        };
        const updatedCart = cartService.addToCart(productToAdd, quantity);
        setCartItems([...updatedCart]);
    };

    const removeItem = (productId) => {
        const updatedCart = cartService.removeFromCart(productId);
        setCartItems([...updatedCart]);
    };

    const updateItemQuantity = (productId, newQuantity) => {
        const updatedCart = cartService.updateQuantity(productId, newQuantity);
        setCartItems([...updatedCart]);
    };

    const clearCartItems = () => {
        const updatedCart = cartService.clearCart();
        setCartItems([...updatedCart]);
    };

    const value = {
        cartItems,
        itemCount,
        cartTotal,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCartItems,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};