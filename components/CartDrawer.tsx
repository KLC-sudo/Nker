import React, { useEffect, useRef } from 'react';
import { useCart } from '../CartContext';
import { useContent } from '../ContentContext';

const CartDrawer: React.FC = () => {
    const { content } = useContent();
    const { cartItems, removeFromCart, updateQty, clearCart, totalItems, totalPrice, isOpen, setIsOpen } = useCart();
    const drawerRef = useRef<HTMLDivElement>(null);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [setIsOpen]);

    // Format price helper
    const formatTotal = (num: number) =>
        `UGX ${num.toLocaleString()}`;

    const handleCheckout = () => {
        clearCart();
        setIsOpen(false);
        // Simple confirmation toast via alert for now
        setTimeout(() => {
            alert('✅ Thank you! Your order has been received. We will contact you shortly to confirm delivery details.');
        }, 200);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                aria-modal="true"
                role="dialog"
                aria-label="Shopping Cart"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
                        {totalItems > 0 && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
                        )}
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                        aria-label="Close cart"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
                            <svg className="w-16 h-16 mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="text-base font-medium">Your cart is empty</p>
                            <p className="text-sm mt-1">Add items from the E-Shop</p>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                                {/* Image */}
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                                    {item.badge && <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase tracking-wide">{item.badge}</span>}
                                    <p className="text-red-600 font-bold text-sm mt-1">{item.price}</p>
                                    {/* Qty controls */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => updateQty(item.id, item.qty - 1)}
                                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors text-sm"
                                        >−</button>
                                        <span className="text-sm font-semibold w-6 text-center">{item.qty}</span>
                                        <button
                                            onClick={() => updateQty(item.id, item.qty + 1)}
                                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors text-sm"
                                        >+</button>
                                    </div>
                                </div>

                                {/* Remove */}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="self-start p-1 text-gray-400 hover:text-red-600 transition-colors"
                                    aria-label="Remove item"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Checkout */}
                {cartItems.length > 0 && (
                    <div className="px-6 py-5 border-t border-gray-100 space-y-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600 font-medium">Total</span>
                            <span className="text-xl font-extrabold text-gray-900">{formatTotal(totalPrice)}</span>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => {
                                    const message = `*New Order Request*\n\n${cartItems.map(item => `- ${item.qty}x ${item.name} (${item.price})`).join('\n')}\n\n*Total: ${formatTotal(totalPrice)}*`;

                                    // Logic: 1. checkoutWhatsApp field -> 2. 'whatsapp' in contactItems -> 3. 'phone' in contactItems -> 4. contactInfo.phone
                                    let rawNumber = content.checkoutWhatsApp || '';

                                    if (!rawNumber) {
                                        const waItem = content.contactItems?.find(i => i.iconSvg === 'whatsapp' || i.label.toLowerCase().includes('whatsapp'));
                                        const phoneItem = content.contactItems?.find(i => i.iconSvg === 'phone' || i.label.toLowerCase().includes('phone'));
                                        rawNumber = waItem?.value || phoneItem?.value || content.contactInfo.phone || '';
                                    }

                                    // Clean non-digits
                                    rawNumber = rawNumber.replace(/[^0-9]/g, '');

                                    if (rawNumber) {
                                        window.open(`https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`, '_blank');
                                        clearCart();
                                        setIsOpen(false);
                                    } else {
                                        alert('No contact number found. Please check the Contact page.');
                                    }
                                }}
                                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 rounded-full transition-all duration-300 hover:scale-[1.02] shadow-md flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.305-5.235c0-5.443 4.492-9.87 9.98-9.87 2.667 0 5.176 1.04 7.062 2.927 1.886 1.886 2.926 4.394 2.926 7.06 0 5.443-4.43 9.87-9.98 9.87M12.057 2.176c-5.418 0-9.825 4.407-9.825 9.825 0 2.102.667 4.053 1.815 5.669l-1.928 7.043 7.215-1.892a9.78 9.78 0 014.723 1.206c5.417 0 9.824-4.407 9.824-9.825 0-5.418-4.406-9.825-9.824-9.825z" /></svg>
                                Order via WhatsApp
                            </button>

                            <button
                                onClick={() => {
                                    const message = `New Order Request:\n\n${cartItems.map(item => `- ${item.qty}x ${item.name} (${item.price})`).join('\n')}\n\nTotal: ${formatTotal(totalPrice)}`;

                                    // Logic: 1. checkoutEmail field -> 2. 'email' in contactItems -> 3. contactInfo.email
                                    let email = content.checkoutEmail || '';

                                    if (!email) {
                                        const emailItem = content.contactItems?.find(i => i.iconSvg === 'mail' || i.label.toLowerCase().includes('email'));
                                        email = emailItem?.value || content.contactInfo.email || '';
                                    }

                                    if (email) {
                                        window.open(`mailto:${email}?subject=Order Request&body=${encodeURIComponent(message)}`, '_blank');
                                        clearCart();
                                        setIsOpen(false);
                                    } else {
                                        alert('No email address found.');
                                    }
                                }}
                                className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-bold py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                Order via Email
                            </button>
                        </div>

                        <button
                            onClick={() => clearCart()}
                            className="w-full text-center text-xs text-gray-400 hover:text-red-500 transition-colors pt-2"
                        >
                            Clear cart
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
