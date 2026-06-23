import React from 'react';
import { Product } from '../types';
import { Star, Eye, Calendar, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onViewDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetail, onAddToCart }: ProductCardProps) {
  // Format price in IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isOutOfStock = product.stockStatus === 'Habis';
  const isPreOrder = product.stockStatus === 'Pre-Order';

  return (
    <div 
      className="group bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
      id={`product-card-${product.id}`}
    >
      {/* Image Block */}
      <div className="relative pt-[85%] bg-zinc-50 overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <span className="px-2.5 py-1 text-[10px] font-accent font-bold uppercase tracking-wider bg-black/75 text-white backdrop-blur-md rounded-md">
            {product.categoryName}
          </span>
          {isPreOrder && (
            <span className="px-2.5 py-1 text-[10px] font-accent font-bold uppercase tracking-wider bg-amber-500 text-white rounded-md w-fit">
              {product.stockStatus}
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-1 text-[10px] font-accent font-bold uppercase tracking-wider bg-red-600 text-white rounded-md w-fit">
              {product.stockStatus}
            </span>
          )}
        </div>

        <button 
          onClick={() => onViewDetail(product)}
          className="absolute inset-0 w-full h-full cursor-pointer"
          title="Lihat Detail Produk"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="px-4 py-2 bg-white text-maroon-900 font-accent font-semibold text-xs rounded-xl shadow-lg inline-flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              Lihat Detail
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </button>

        {/* View Count floating stats */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white/95 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {product.views}
        </div>
      </div>

      {/* Content Block */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Artisan Link */}
        <div className="text-xs text-zinc-400 font-accent font-medium mb-1 line-clamp-1">
          By {product.umkmName}
        </div>

        <h3 className="font-display font-medium text-zinc-900 group-hover:text-maroon-700 text-base leading-snug line-clamp-2 h-12 mb-2">
          <button onClick={() => onViewDetail(product)} className="text-left cursor-pointer hover:underline">
            {product.name}
          </button>
        </h3>

        {/* Motif Info if available */}
        {product.motifName && (
          <p className="text-[11px] text-maroon-600 font-accent font-semibold bg-maroon-50 px-2 py-0.5 rounded mb-3 w-fit line-clamp-1">
            Motif: {product.motifName.split(' ')[0]}
          </p>
        )}

        {/* Price & Rating */}
        <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-400">Harga</div>
            <div className="font-accent font-bold text-emerald-600 text-base">
              {product.isPricePublic ? formatPrice(product.price) : 'Hubungi Seller'}
            </div>
          </div>

          <div className="flex items-center gap-1 py-1 px-2 bg-zinc-50 rounded-lg">
            <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
            <span className="text-xs font-bold text-zinc-700">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => onViewDetail(product)}
            className="py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-accent font-semibold rounded-xl text-center transition-all duration-200 cursor-pointer"
            id={`btn-view-${product.id}`}
          >
            Info Lengkap
          </button>
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`py-2.5 px-3 text-xs font-accent font-semibold rounded-xl text-center border transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 ${
              isOutOfStock
                ? 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed'
                : 'bg-maroon-600 hover:bg-maroon-700 text-white border-maroon-700 hover:border-maroon-800 active:scale-95'
            }`}
            id={`btn-cart-${product.id}`}
          >
            {isOutOfStock ? 'Stok Habis' : 'Keranjang'}
          </button>
        </div>
      </div>
    </div>
  );
}
