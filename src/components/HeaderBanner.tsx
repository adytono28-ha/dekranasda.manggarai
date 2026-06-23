import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Award, ShoppingBag, Users, Heart } from 'lucide-react';
import { SystemSettings } from '../types';

interface StatsProps {
  umkmCount: number;
  productCount: number;
  categoriesCount: number;
  onExplore: () => void;
  settings?: SystemSettings;
}

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=1600&h=600', // Hand-weaving
  'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?auto=format&fit=crop&q=80&w=1600&h=600', // Hand-woven craft texture
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=1600&h=600', // Coffee Plantation Colol
];

export default function HeaderBanner({ umkmCount, productCount, categoriesCount, onExplore, settings }: StatsProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  const images = settings?.bannerImages?.filter(Boolean).length 
    ? settings.bannerImages.filter(Boolean) 
    : HERO_IMAGES;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative mb-12">
      {/* Slider Hero */}
      <div className="relative h-[480px] md:h-[560px] overflow-hidden rounded-3xl shadow-2xl bg-black">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeSlide ? 'opacity-70' : 'opacity-0'
            }`}
          >
            <img
              src={img}
              alt="Manggarai Pride Banner"
              className="w-full h-full object-cover transform scale-105 transition-transform duration-[6000ms]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-maroon-900 via-maroon-800/80 to-transparent" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-3xl text-white z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/20 border border-gold-400/40 text-gold-400 rounded-full text-xs font-accent tracking-widest uppercase mb-4 w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            Warisan Leluhur {settings?.brandSub || 'MANGGARAI, NTT'}
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium leading-tight tracking-tight mb-4 text-maroon-50 select-none">
            {settings?.bannerTitle || 'Dekranasda Kabupaten Manggarai'}
            <span className="block text-gold-400 text-lg sm:text-xl md:text-2xl font-light italic mt-2">
              "{settings?.bannerSub || 'Melestarikan Budaya, Meningkatkan Ekonomi Kreatif Daerah'}"
            </span>
          </h1>

          <p className="text-sm md:text-base text-maroon-100/90 font-sans font-light leading-relaxed mb-8 max-w-xl">
            Selamat datang di katalog dan media promosi resmi Dewan Kerajinan Nasional Daerah {settings?.brandName || 'DEKRANASDA'} {settings?.brandSub || 'KAB. MANGGARAI, NTT'}. 
            Temukan koleksi eksklusif kain Tenun Songke Flores premium dan aneka kerajinan buatan pengrajin lokal binaan kami.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={onExplore}
              className="px-6 py-3 bg-gold-500 hover:bg-gold-600 active:scale-95 text-black font-semibold rounded-xl inline-flex items-center gap-2 border border-gold-400 font-accent transition-all duration-200 cursor-pointer shadow-lg"
              id="btn-hero-explore"
            >
              Jelajahi Katalog
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#about-section"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/20 backdrop-blur-md transition-all duration-200 text-center"
              id="btn-hero-about"
            >
              Tentang Kami
            </a>
          </div>
        </div>

        {/* Carousel indicators */}
        <div className="absolute bottom-6 right-6 flex gap-2 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`w-3 h-1.5 rounded-full transition-all duration-300 ${
                idx === activeSlide ? 'bg-gold-400 w-6' : 'bg-white/40'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Stats overlapping banner */}
      <div className="relative -mt-10 sm:-mt-12 mx-auto max-w-6xl px-4 z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-maroon-100 rounded-2xl shadow-xl">
          <div className="flex items-center gap-4 border-r border-maroon-50 last:border-0 pr-4">
            <div className="p-3 bg-maroon-50 rounded-xl text-maroon-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-accent font-bold text-maroon-900" id="stat-umkm">
                {umkmCount}
              </div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-accent font-medium">UMKM Binaan</div>
            </div>
          </div>

          <div className="flex items-center gap-4 md:border-r border-maroon-50 last:border-0 md:pr-4">
            <div className="p-3 bg-maroon-50 rounded-xl text-maroon-500">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-accent font-bold text-maroon-900" id="stat-product">
                {productCount}
              </div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-accent font-medium font-medium">Produk Binaan</div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-r border-maroon-50 last:border-0 pr-4">
            <div className="p-3 bg-maroon-50 rounded-xl text-maroon-500">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-accent font-bold text-maroon-900" id="stat-categories">
                {categoriesCount}
              </div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-accent font-medium">Kategori Khas</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-gold-400/20 rounded-xl text-gold-600">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-accent font-bold text-maroon-900" id="stat-preservation">
                100%
              </div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-accent font-medium">Karya Otentik</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
