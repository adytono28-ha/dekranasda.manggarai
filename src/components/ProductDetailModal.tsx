import { useState, useEffect } from 'react';
import { Product, UMKM } from '../types';
import { X, Star, Heart, MapPin, MessageSquare, Plus, ShoppingCart, Tag, Check, Calendar } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  artisan: UMKM | undefined;
  allProducts: Product[];
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void; // for Related Products swap
}

export default function ProductDetailModal({
  product,
  artisan,
  allProducts,
  onClose,
  onAddToCart,
  onSelectProduct,
}: ProductDetailModalProps) {
  const allImages = [product.imageUrl, ...(product.galleryUrls || [])].filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Sync active image when product changes
  useEffect(() => {
    setActiveIndex(0);
    setIsAutoScrolling(true);
    // Increment local simulated views
    product.views += 1;
  }, [product]);

  // Self-scrolling automatic slideshow effect (every 3 seconds)
  useEffect(() => {
    if (allImages.length <= 1 || !isAutoScrolling) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % allImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [allImages.length, isAutoScrolling]);

  const activeImage = allImages[activeIndex] || product.imageUrl;

  // Filter 3 related products from the same category (excluding current)
  const relatedProducts = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsAppClick = () => {
    if (!artisan) return;
    const cleanPhone = artisan.phone.replace(/[^0-9]/g, '');
    const priceText = product.isPricePublic ? formatPrice(product.price) : 'Harga Kesepakatan';
    const text = `Halo ${artisan.owner} (${artisan.name}), saya melihat produk *${product.name}* (${priceText}) di Website Katalog Dekranasda Manggarai. Apakah produk ini tersedia? Mohon info detail pemesanan. Terima kasih.`;
    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleAddToCart = () => {
    onAddToCart(product);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Container Card */}
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl relative overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header Close Panel */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-rose-600 shadow-md transition-all cursor-pointer"
            title="Tambah ke Favorit"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-600' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-black/70 hover:bg-black text-white hover:scale-105 active:scale-95 shadow-md transition-all cursor-pointer"
            title="Tutup Detail"
            id="btn-close-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container Body */}
        <div className="overflow-y-auto flex-grow p-6 sm:p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* LEFT SIDE: Image Gallery Panel (5 cols) */}
            <div className="md:col-span-6 flex flex-col gap-4">
              <div className="relative pt-[100%] rounded-2xl bg-zinc-50 overflow-hidden border border-zinc-100">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-500 transform duration-500 scale-100"
                  referrerPolicy="no-referrer"
                />
                
                {/* Arrow navigation indicators for self-scrolling slider */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => {
                        setIsAutoScrolling(false);
                        setActiveIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center font-bold text-sm cursor-pointer z-10 transition-colors"
                      title="Sebelumnya"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => {
                        setIsAutoScrolling(false);
                        setActiveIndex((prev) => (prev + 1) % allImages.length);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center font-bold text-sm cursor-pointer z-10 transition-colors"
                      title="Berikutnya"
                    >
                      ›
                    </button>
                  </>
                )}

                {/* Slider progress indicators dot-slider style */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
                    {allImages.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => {
                          setIsAutoScrolling(false);
                          setActiveIndex(dotIdx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          dotIdx === activeIndex ? 'bg-gold-400 w-4' : 'bg-white/60 hover:bg-white'
                        }`}
                        title={`Slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                )}
                
                {/* Float stock */}
                <span className="absolute bottom-4 left-4 px-3.5 py-1.5 bg-black/80 backdrop-blur-md rounded-xl text-xs font-accent font-bold uppercase tracking-wider text-white">
                  Stok: {product.stockStatus}
                </span>
              </div>

              {/* Gallery Thumbnails */}
              <div className="flex gap-2 pb-2 overflow-x-auto">
                <button
                  onClick={() => {
                    setIsAutoScrolling(false);
                    setActiveIndex(0);
                  }}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 cursor-pointer ${
                    activeIndex === 0 ? 'border-maroon-600 bg-maroon-50' : 'border-transparent hover:border-zinc-300'
                  }`}
                >
                  <img src={product.imageUrl} className="w-full h-full object-cover" alt="Main thumb" referrerPolicy="no-referrer" />
                </button>
                {product.galleryUrls && product.galleryUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsAutoScrolling(false);
                      setActiveIndex(idx + 1);
                    }}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 cursor-pointer ${
                      activeIndex === (idx + 1) ? 'border-maroon-600 bg-maroon-50' : 'border-transparent hover:border-zinc-300'
                    }`}
                  >
                    <img src={url} className="w-full h-full object-cover" alt={`Gallery ${idx + 1}`} referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE: Information Sheet (7 cols) */}
            <div className="md:col-span-6 flex flex-col">
              {/* Category Breadcrumb */}
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-maroon-50 text-maroon-700 text-xs font-accent font-bold uppercase">
                  <Tag className="w-3.5 h-3.5" />
                  {product.categoryName}
                </span>
                
                <span className="text-xs text-zinc-400">Viewed {product.views} times</span>
              </div>

              {/* Title & Price */}
              <h1 className="text-2xl sm:text-3xl font-display font-medium text-zinc-900 mb-3 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-6 bg-emerald-55/35 p-4 rounded-xl border border-emerald-100/50 bg-emerald-50/40">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-accent font-bold">Katalog Price:</span>
                <span className="text-2xl sm:text-3xl font-accent font-bold text-emerald-600">
                  {product.isPricePublic ? formatPrice(product.price) : 'Hubungi Seller'}
                </span>
              </div>

              {/* Specs Grid */}
              <div className="border border-zinc-100 rounded-2xl p-4 sm:p-5 mb-6 text-sm">
                <h4 className="font-accent font-bold text-zinc-900 mb-3 text-xs uppercase tracking-wider">Spesifikasi Karya</h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div>
                    <span className="text-zinc-400 block text-xs">Bahan Utama</span>
                    <span className="text-zinc-800 font-medium">{product.materials}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-xs">Ukuran / Dimensi</span>
                    <span className="text-zinc-800 font-medium">{product.size}</span>
                  </div>
                  {product.motifName && (
                    <div className="col-span-2 border-t border-zinc-50 pt-2 mt-1">
                      <span className="text-zinc-400 block text-xs">Karakteristik Motif Seni</span>
                      <span className="text-maroon-700 font-semibold">{product.motifName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="font-accent font-bold text-zinc-900 mb-2 text-xs uppercase tracking-wider">Deskripsi Produk</h4>
                <p className="text-zinc-600 text-sm font-light leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Action Rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                {artisan && (
                  <button
                    onClick={handleWhatsAppClick}
                    className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-accent font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    id="btn-whatsapp-seller"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Hubungi via WhatsApp
                  </button>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={product.stockStatus === 'Habis'}
                  className={`py-3 px-4 font-accent font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                    product.stockStatus === 'Habis'
                      ? 'bg-zinc-100 border border-zinc-200 text-zinc-400 cursor-not-allowed'
                      : 'bg-maroon-600 hover:bg-maroon-700 active:scale-95 text-white'
                  }`}
                  id="btn-add-to-cart-modal"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.stockStatus === 'Habis' ? 'Stok Habis' : 'Tambah ke Keranjang'}
                </button>
              </div>

              {successToast && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-1.5 animate-fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Karya berhasil dimasukkan ke keranjang belanja lokal Anda! Sentuh ikon keranjang di atas untuk checkout.
                </div>
              )}
            </div>

          </div>

          {/* BELOW BLOCK: RELATED PRODUCTS (Rhythm & variation) */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-zinc-100">
              <h3 className="font-display font-medium text-lg sm:text-xl text-zinc-900 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
                Rekomendasi Produk Terkait
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((related) => (
                  <button
                    key={related.id}
                    onClick={() => {
                      onSelectProduct(related);
                    }}
                    className="group flex gap-3 text-left p-2.5 rounded-2xl border border-zinc-100 hover:border-maroon-200 hover:bg-maroon-50/20 transition-all cursor-pointer"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-50 relative">
                      <img
                        src={related.imageUrl}
                        alt={related.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex flex-col justify-center overflow-hidden">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                        {related.categoryName}
                      </span>
                      <h4 className="font-display font-medium text-zinc-800 text-xs sm:text-sm line-clamp-2 leading-tight group-hover:text-maroon-700">
                        {related.name}
                      </h4>
                      <span className="font-accent font-bold text-emerald-600 text-xs sm:text-sm mt-1">
                        {related.isPricePublic ? formatPrice(related.price) : 'Hubungi Seller'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
