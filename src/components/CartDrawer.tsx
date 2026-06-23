import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, MessageSquare, ShoppingBag, Info } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  whatsappNumber?: string;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  whatsappNumber,
}: CartDrawerProps) {
  if (!isOpen) return null;

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalAmount = cartItems.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Generate pre-filled WhatsApp text for the entire shopping cart checkout
  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    let textLine = `Halo *Official Dekranasda Kabupaten Manggarai*, saya ingin memesan produk kerajinan khas berikut dari Website Katalog:\n\n`;

    cartItems.forEach((item, idx) => {
      const priceText = item.product.isPricePublic ? formatPrice(item.product.price) : 'Hubungi Seller';
      const subtotal = item.product.price * item.quantity;
      textLine += `${idx + 1}. *${item.product.name}*\n   - Kategori: ${item.product.categoryName}\n   - Pengrajin: ${item.product.umkmName}\n   - Kuantitas: ${item.quantity} x ${priceText} = *${formatPrice(subtotal)}*\n\n`;
    });

    textLine += `*Total Belanja:* *${formatPrice(totalAmount)}*\n\n`;
    textLine += `Mohon dibantu instruksi untuk proses pengiriman, ongkos kirim, dan metode pembayarannya. Terima kasih!`;

    const encodedText = encodeURIComponent(textLine);
    // Use configured WhatsApp number, clean up non-digits, replace leading 0 with 62
    let cleanPhone = (whatsappNumber || '6281234567890').replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Background slide backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer content board */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-left">
        
        {/* Header Block */}
        <div className="p-5 border-b border-zinc-150 flex items-center justify-between bg-songke-light">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-maroon-650 text-white rounded-lg">
              <ShoppingBag className="w-5 h-5 text-maroon-700 hover:text-maroon-800" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-zinc-900 leading-snug">Keranjang Belanja</h3>
              <p className="text-zinc-500 text-xs font-light">{totalItems} karya terpilih</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-zinc-200 text-zinc-400 hover:text-zinc-705 cursor-pointer"
            title="Tutup Keranjang"
            id="btn-close-cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* List of checkout items */}
        <div className="flex-grow p-5 overflow-y-auto space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 bg-maroon-50 rounded-full flex items-center justify-center text-maroon-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-zinc-500 text-sm font-light">Keranjang belanja lokal Anda kosong.</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-maroon-700 hover:bg-maroon-800 text-white text-xs font-accent font-semibold rounded-xl transition"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3.5 p-3.5 rounded-2xl bg-zinc-50/70 border border-zinc-100 hover:border-maroon-100 transition duration-200"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0 relative border border-zinc-200">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info Text */}
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-display font-medium text-zinc-900 text-xs sm:text-sm line-clamp-1">
                      {item.product.name}
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-accent">By {item.product.umkmName}</p>
                    <p className="text-emerald-600 font-accent font-bold text-xs sm:text-sm mt-0.5">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>

                  {/* Quantity and trash selectors */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100/60">
                    <div className="flex items-center border border-zinc-200 rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="p-1 px-2.5 hover:bg-zinc-100 text-zinc-500 cursor-pointer"
                        title="Kurangi Kuantitas"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      
                      <span className="px-2 text-xs font-bold text-zinc-800 select-none">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="p-1 px-2.5 hover:bg-zinc-100 text-zinc-500 cursor-pointer"
                        title="Tambah Kuantitas"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-zinc-400 hover:text-red-655 p-1 hover:bg-zinc-200/50 rounded-lg cursor-pointer transition-colors"
                      title="Hapus Karya"
                    >
                      <Trash2 className="w-4 h-4 text-zinc-400 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Billing checkout button */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-zinc-200 bg-songke-light/50">
            {/* Calculation rows */}
            <div className="space-y-2 mb-4 text-sm font-sans">
              <div className="flex justify-between text-zinc-500 font-light">
                <span>Subtotal ({totalItems} produk)</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-zinc-500 font-light text-xs">
                <span className="flex items-center gap-1">
                  Ongkos Kirim
                  <Info className="w-3 h-3 text-maroon-500" title="Dihitung pas pembayaran" />
                </span>
                <span className="italic text-emerald-650 font-medium">Ditentukan Seller</span>
              </div>
              <div className="border-t border-zinc-150 pt-2 flex justify-between font-accent font-bold text-zinc-90 w-full text-base">
                <span className="text-zinc-700 font-medium font-accent">Total Estimasi</span>
                <span className="text-emerald-600 font-extrabold">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            {/* Hint box */}
            <p className="text-[11px] text-zinc-400 bg-white p-2.5 rounded-xl border border-zinc-150 leading-relaxed mb-4 font-light">
              Pemesanan di Website Katalog Dekranasda sifatnya non-tunai langsung ke pengrajin. Kami menyusun pesanan ini dalam format rapi untuk dikirimkan melalui WhatsApp agar admin kami dapat mengkonfirmasi pesanan dan pembayaran Anda secara personal.
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={onClearCart}
                className="py-3 bg-zinc-100 hover:bg-zinc-205 text-zinc-600 text-xs font-accent font-semibold rounded-xl text-center cursor-pointer active:scale-95 transition"
              >
                Kosongkan
              </button>

              <button
                onClick={handleWhatsAppCheckout}
                className="col-span-2 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-accent font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition"
              >
                <MessageSquare className="w-4 h-4" />
                Kirim Pembelian (WA)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
