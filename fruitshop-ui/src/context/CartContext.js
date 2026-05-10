import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export const CartContext = createContext();

export default function CartProvider({ children }) {

    const [cartItems, setCartItems] = useState([]);
    const { user } = useContext(AuthContext);

    // Fetch cart from backend on load
    const fetchCart = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await api.get("/cart");
            if (response.data.success && response.data.data) {
                const items = response.data.data.items.map(item => ({
                    cartItemId: item.id,
                    ...item.product,
                    quantity: item.quantity
                }));
                setCartItems(items);
            }
        } catch (error) {
            console.error("Failed to fetch cart", error);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [user, fetchCart]);

    // ADD
    const addToCart = useCallback(async (product, qty = 1) => {
        if (!user) {
            toast.warning("Vui lòng đăng nhập để thêm vào giỏ hàng");
            return;
        }

        try {
            await api.post("/cart/items", { productId: product.id, quantity: qty });
            fetchCart();
            toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
        } catch (error) {
            console.error("Failed to add to cart", error);
            toast.error("Không thể thêm vào giỏ hàng");
        }
    }, [user, fetchCart]);

    // INCREASE
    const increaseQty = useCallback(async (id, cartItemId) => {
        if (!user) return;
        
        const item = cartItems.find(i => i.id === id);
        if (item) {
            try {
                await api.put(`/cart/items/${cartItemId}?quantity=${item.quantity + 1}`);
                fetchCart();
            } catch (error) {
                console.error("Failed to increase quantity", error);
            }
        }
    }, [user, cartItems, fetchCart]);

    // REMOVE
    const removeItem = useCallback(async (id, cartItemId) => {
        if (!user) return;

        try {
            await api.delete(`/cart/items/${cartItemId}`);
            fetchCart();
        } catch (error) {
            console.error("Failed to remove item", error);
        }
    }, [user, fetchCart]);

    // DECREASE
    const decreaseQty = useCallback(async (id, cartItemId) => {
        if (!user) return;

        const item = cartItems.find(i => i.id === id);
        if (item) {
            if (item.quantity > 1) {
                try {
                    await api.put(`/cart/items/${cartItemId}?quantity=${item.quantity - 1}`);
                    fetchCart();
                } catch (error) {
                    console.error("Failed to decrease quantity", error);
                }
            } else {
                removeItem(id, cartItemId);
            }
        }
    }, [user, cartItems, fetchCart, removeItem]);

    // TOTAL
    const totalPrice = cartItems.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    const totalQuantity = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const value = useMemo(() => ({
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        totalPrice,
        totalQuantity,
        fetchCart
    }), [cartItems, totalPrice, totalQuantity, addToCart, increaseQty, decreaseQty, removeItem, fetchCart]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}