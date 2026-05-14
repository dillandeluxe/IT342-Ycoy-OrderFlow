import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

// 1. Create the Context
const CartContext = createContext();

// 2. Create the Provider Component
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const fetchCart = async (buyerId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/cart/${buyerId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCartItems(data);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    // Fetch initial cart setup if logged in
    useEffect(() => {
        const userId = localStorage.getItem('userId') || 1;
        fetchCart(userId);
    }, []);

    // Function to talk to our new Spring Boot backend!
    const addToCart = async (buyerId, foodItemId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/cart/${buyerId}/add/${foodItemId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const newItem = await response.json();
                console.log("Item added to database cart:", newItem);
                toast.success("Successfully added to your cart!");
                // Refresh cart from backend
                await fetchCart(buyerId);
            } else {
                console.error("Failed to add to cart. Server responded with an error.");
                toast.error("Failed to add to cart. Please try again.");
            }
        } catch (error) {
            console.error("Error connecting to backend:", error);
            toast.error("Connection error while adding to cart.");
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/cart/${cartItemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success("Item removed from cart");
                const userId = localStorage.getItem('userId') || 1;
                await fetchCart(userId);
            } else {
                toast.error("Failed to remove item.");
            }
        } catch (error) {
            console.error("Error removing item:", error);
            toast.error("Connection error while removing item.");
        }
    };

    // NEW: Full checkout function
    const checkout = async (paymentMethod = 'CASH') => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            toast.error("Please log in to checkout.");
            return { success: false };
        }

        setIsCheckingOut(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:8080/api/transactions/checkout/${userId}?paymentMethod=${paymentMethod}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                // Clear cart in UI
                setCartItems([]);
                return { success: true, orderNumber: data.orderNumber, totalAmount: data.totalAmount };
            } else {
                const errorMsg = typeof data === 'string' ? data : (data.message || 'Checkout failed. Please try again.');
                toast.error(errorMsg);
                return { success: false, error: errorMsg };
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Network error during checkout.");
            return { success: false, error: error.message };
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, fetchCart, removeFromCart, checkout, isCheckingOut }}>
            {children}
        </CartContext.Provider>
    );
};

// 3. Custom hook so your other files can easily use the cart
export const useCart = () => useContext(CartContext);