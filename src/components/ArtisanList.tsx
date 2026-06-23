import { useState } from 'react';
import { UMKM, Product } from '../types';
import { Search, MapPin, Phone, Star, ShoppingBag, ArrowRight, Award, UserCheck } from 'lucide-react';

interface ArtisanListProps {
  artisans: UMKM[];
  allProducts: Product[];
  onViewProduct: (product: Product) => void;
}

export default function ArtisanList({ artisans, allProducts, onViewProduct }: ArtisanListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState('Semua');

  // Find all unique subdistricts
  const subdistricts = ['Semua', ...Array.from(new Set(artisans.map(art => art.subdistrict)))];

  // Filter artisans
  const filteredArtisans = artisans.filter(art => {
    const matchesSearch = 
      art.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubdistrict = selectedSubdistrict === 'Semua' || art.subdistrict === selectedSubdistrict;
    return matchesSearch && matchesSubdistrict;
  });

  const handleWhatsAppContact = (artisan: UMKM) => {
    const cleanPhone = artisan.phone.replace(/[^0-9]/g, '');
    const text = `Halo Bapak/Ibu *${artisan.owner}*, saya melihat profil *${artisan.name}* di Portal Dekranasda Kabupaten Manggarai. Saya ingin bertanya info tentang kerajinan binaan Anda. Terima kasih.`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
  };

  return (
    <div className="space-y-8" id="artisan-directory-view">
      {/* Intro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-100 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-medium text-zinc-900 flex items-center gap-2">
            <span className="w-1.5 h-8 bg-maroon-600 rounded-full" />
            Galeri Pengrajin Binaan
          </h2>
          <p className="text-zinc-500 text-sm mt-1 max-w-xl font-light">
            Dekranasda Kabupaten Manggarai membina kelompok-kelompok pengrajin rakyat demi melestarikan teknik warisan leluhur sekaligus menggerakkan inklusi ekonomi lokal.
          </p>
        </div>

        {/* Subdistrict Pill Filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {subdistricts.map((sub, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSubdistrict(sub)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-accent font-semibold flex-shrink-0 transition-all cursor-pointer ${
                selectedSubdistrict === sub
                  ? 'bg-maroon-700 text-white'
                  : 'bg-zinc-100 text-zinc-650 hover:bg-zinc-200'
              }`}
            >
              {sub === 'Semua' ? 'Semua Kecamatan' : sub}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
          <Search className="w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder="Cari pengrajin, nama pemilik, atau keahlian..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-xl focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 text-sm shadow-xs transition-colors"
          id="artisan-search-input"
        />
      </div>

      {/* Main Grid */}
      {filteredArtisans.length === 0 ? (
        <div className="text-center py-12 p-8 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
          <p className="text-zinc-500 text-sm">Tidak ditemukan pengrajin binaan yang cocok dengan pencarian Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredArtisans.map((art) => {
            // Find products belonging to this artisan
            const artisanProducts = allProducts.filter(p => p.umkmId === art.id);

            return (
              <div 
                key={art.id} 
                className="bg-white rounded-3xl border border-zinc-100 shadow-sm hover:shadow-lg transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between"
                id={`artisan-card-${art.id}`}
              >
                <div>
                  {/* Top Header Card */}
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center pb-5 border-b border-zinc-100 mb-5">
                    <img
                      src={art.avatar}
                      alt={art.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-maroon-100 shadow-md flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-700 text-[10px] font-accent font-bold uppercase tracking-wider">
                          Est. {art.established}
                        </span>
                        {art.featured && (
                          <span className="px-2.5 py-0.5 rounded bg-maroon-50 text-maroon-700 text-[10px] font-accent font-bold uppercase tracking-wider flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            Unggulan
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-semibold text-lg text-zinc-900 leading-snug">
                        {art.name}
                      </h3>

                      <div className="text-sm text-zinc-500 flex items-center gap-1 font-light">
                        <UserCheck className="w-4 h-4 text-maroon-600 flex-shrink-0" />
                        <span>Pemilik: {art.owner}</span>
                      </div>

                      <div className="text-xs text-zinc-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-maroon-500 flex-shrink-0" />
                        <span>Kec. {art.subdistrict} ({art.village})</span>
                      </div>
                    </div>
                  </div>

                  {/* Body description */}
                  <p className="text-zinc-600 text-sm font-light leading-relaxed mb-6">
                    {art.description}
                  </p>

                  {/* Crafted Products carousels if available */}
                  {artisanProducts.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-xs font-accent font-bold text-zinc-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4 text-maroon-700" />
                        Karya Unggulan {art.name}:
                      </h4>
                      
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                        {artisanProducts.map((prod) => (
                          <button
                            key={prod.id}
                            onClick={() => onViewProduct(prod)}
                            className="bg-zinc-50 rounded-xl p-2 border border-zinc-100 hover:border-maroon-200 transition-all flex items-center gap-2.5 text-left text-xs w-52 flex-shrink-0 cursor-pointer"
                          >
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="overflow-hidden">
                              <p className="font-display font-medium text-zinc-900 line-clamp-1 leading-tight">{prod.name}</p>
                              <p className="text-maroon-700 font-semibold font-accent mt-0.5">
                                {prod.isPricePublic ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(prod.price) : 'Hubungi'}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Buttons row */}
                <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                  {/* Rating display */}
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
                    <span className="text-sm font-bold text-zinc-800">{art.rating.toFixed(1)}</span>
                    <span className="text-xs text-zinc-400">({Math.round(art.rating * 12)} ulasan)</span>
                  </div>

                  <button
                    onClick={() => handleWhatsAppContact(art)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-accent font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Hubungi Penjual
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
