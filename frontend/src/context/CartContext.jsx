import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const CART_KEY = 'caz_cart';

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch {
            return [];
        }
    });

    // Persist cart to localStorage on every change
    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems((prev) => {
            const existing = prev.find((i) => i._id === product._id);
            if (existing) {
                const newQty = existing.quantity + quantity;
                if (newQty > product.stock) {
                    toast.error(`Only ${product.stock} units available.`);
                    return prev;
                }
                toast.success('Quantity updated in cart!');
                return prev.map((i) =>
                    i._id === product._id ? { ...i, quantity: newQty } : i
                );
            }
            toast.success(`${product.name} added to cart! 🛒`);
            return [...prev, { ...product, quantity }];
        });
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) return removeFromCart(productId);
        setCartItems((prev) =>
            prev.map((i) => (i._id === productId ? { ...i, quantity } : i))
        );
    };

    const removeFromCart = (productId) => {
        setCartItems((prev) => prev.filter((i) => i._id !== productId));
        toast.success('Item removed from cart.');
    };

    const clearCart = () => setCartItems([]);

    const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};
