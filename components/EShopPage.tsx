import React, { useState, useMemo } from 'react';
import { useContent } from '../ContentContext';
import { useCart, productToCartItem } from '../CartContext';

const BADGE_FILTERS = ['All', 'POPULAR', 'PREMIUM'];

const EShopPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const { content } = useContent();
    const { addToCart } = useCart();
    const products = content.bestSellers?.products || [];
    const [filter, setFilter] = useState('All');
    const [addedId, setAddedId] = useState<string | null>(null);

    const filtered = useMemo(() =>
        filter === 'All' ? products : products.filter(p => p.badge?.toUpperCase() === filter),
        [products, filter]
    );

    const handleAdd = (product: typeof products[0]) => {
        addToCart(productToCartItem(product));
        const id = product.name.toLowerCase().replace(/\s+/g, '-');
        setAddedId(id);
        setTimeout(() => setAddedId(null), 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page header */}
            <div className="bg-white border-b border-gray-100 sticky top-20 z-30">
                <div className="max-w-6xl mx-auto px-6 lg:px-8 py-5 flex items-center gap-4">
                    <button
                        onClick={() => onNavigate('home')}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Home
                    </button>
                    <span className="text-gray-300">/</span>
                    <h1 className="text-lg font-extrabold text-gray-900">{content.bestSellers?.title || 'E-Shop'}</h1>

                    {/* Filter pills */}
                    <div className="ml-auto flex gap-2 flex-wrap">
                        {BADGE_FILTERS.map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${filter === f ? 'bg-red-600 border-red-600 text-white' : 'border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-600'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product grid */}
            <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
                {filtered.length === 0 ? (
                    <div className="text-center py-24 text-gray-400">
                        <p className="text-lg font-semibold">No products found</p>
                        <button onClick={() => setFilter('All')} className="mt-3 text-sm text-red-600 hover:underline">Show all</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filtered.map((p, i) => {
                            const id = p.name.toLowerCase().replace(/\s+/g, '-');
                            const justAdded = addedId === id;
                            return (
                                <div key={i} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                                    {/* Image */}
                                    <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                                        {p.badge && (
                                            <span className="absolute top-3 left-3 z-10 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold tracking-widest uppercase rounded-full">
                                                {p.badge}
                                            </span>
                                        )}
                                        {p.image ? (
                                            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-gray-300 p-6 text-center">
                                                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-xs">Image via CMS</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <p className="font-semibold text-gray-900 text-sm flex-1 leading-snug">{p.name}</p>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-base font-extrabold text-red-600">{p.price}</span>
                                        </div>
                                        <button
                                            onClick={() => handleAdd(p)}
                                            className={`mt-3 w-full py-2 rounded-full text-sm font-bold transition-all duration-300 ${justAdded ? 'bg-green-600 text-white scale-95' : 'bg-red-600 hover:bg-red-700 text-white hover:scale-[1.02]'}`}
                                        >
                                            {justAdded ? '✓ Added!' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Category note */}
                <div className="mt-16 text-center">
                    <p className="text-gray-500 text-sm">
                        All prices in <strong>UGX</strong>. Contact us via WhatsApp for bulk orders or custom requests.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EShopPage;
