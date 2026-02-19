import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
    id: string;          // unique: product name slug
    name: string;
    price: string;       // display string, e.g. "UGX 15,000"
    priceNum: number;    // parsed numeric for totalling
    image: string;
    badge?: string;
    qty: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, 'qty'>) => void;
    removeFromCart: (id: string) => void;
    updateQty: (id: string, qty: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'anker_cart';

function parsePrice(priceStr: string): number {
    // Extract numeric digits from strings like "UGX 15,000"
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
}

function slugify(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [isOpen, setIsOpen] = useState(false);

    // Persist to localStorage on every change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = useCallback((item: Omit<CartItem, 'qty'>) => {
        setCartItems(prev => {
            const existing = prev.find(c => c.id === item.id);
            if (existing) {
                return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
            }
            return [...prev, { ...item, qty: 1 }];
        });
        setIsOpen(true);
    }, []);

    const removeFromCart = useCallback((id: string) => {
        setCartItems(prev => prev.filter(c => c.id !== id));
    }, []);

    const updateQty = useCallback((id: string, qty: number) => {
        if (qty <= 0) {
            setCartItems(prev => prev.filter(c => c.id !== id));
        } else {
            setCartItems(prev => prev.map(c => c.id === id ? { ...c, qty } : c));
        }
    }, []);

    const clearCart = useCallback(() => setCartItems([]), []);

    const totalItems = cartItems.reduce((sum, c) => sum + c.qty, 0);
    const totalPrice = cartItems.reduce((sum, c) => sum + c.priceNum * c.qty, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice, isOpen, setIsOpen }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};

// Helper to build a CartItem from a Product
export function productToCartItem(product: { name: string; image: string; price: string; badge?: string }): Omit<CartItem, 'qty'> {
    return {
        id: slugify(product.name),
        name: product.name,
        price: product.price,
        priceNum: parsePrice(product.price),
        image: product.image,
        badge: product.badge,
    };
}
