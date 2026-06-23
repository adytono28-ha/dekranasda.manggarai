import React, { useState, useEffect } from 'react';
import { Product, UMKM, NewsItem, CartItem, CategoryId, Category, SystemSettings, Testimonial } from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_UMKM, 
  INITIAL_NEWS, 
  INITIAL_CATEGORIES,
  INITIAL_SETTINGS,
  INITIAL_TESTIMONIALS
} from './data/initialData';
import { dbStorage } from './utils/dbStorage';

// Component imports
import HeaderBanner from './components/HeaderBanner';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import ArtisanList from './components/ArtisanList';
import NewsSection from './components/NewsSection';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import AboutSection from './components/AboutSection';

// Lucide icons
import { 
  Menu, X, ShoppingCart, Search, Filter, RefreshCw, ChevronRight, 
  MapPin, Phone, Award, Leaf, Calendar, ArrowRight, BookOpen, Layers,
  MessageSquare, Star, Check, Image as ImageIcon
} from 'lucide-react';

export default function App() {
  // Navigation active tab State
  // Values: 'home' | 'catalog' | 'artisans' | 'news' | 'about' | 'portal'
  const [activeTab, setActiveTab] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Database core states loaded with localStorage support
  const [products, setProducts] = useState<Product[]>([]);
  const [artisans, setArtisans] = useState<UMKM[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // State for submitting a testimonial
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [testiForm, setTestiForm] = useState<{
    name: string;
    role: string;
    text: string;
    rating: number;
    images: string[];
  }>({
    name: '',
    role: 'Pelanggan',
    text: '',
    rating: 5,
    images: [],
  });
  const [testiSubmitSuccess, setTestiSubmitSuccess] = useState(false);

  // Local shopping cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Active viewed product for details overlay modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // CATALOG FILTER STATES
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState<string>('all');
  const [catalogStock, setCatalogStock] = useState<string>('all');
  const [catalogMaxPrice, setCatalogMaxPrice] = useState<number>(5000000);

  // Persist / Load master data to localStorage & dbStorage (IndexedDB)
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // 1. Products
        const cachedProducts = await dbStorage.getItem<Product[]>('dekranasda_products');
        if (cachedProducts) {
          setProducts(cachedProducts);
        } else {
          const savedProducts = localStorage.getItem('dekranasda_products');
          if (savedProducts) {
            const parsed = JSON.parse(savedProducts);
            setProducts(parsed);
            await dbStorage.setItem('dekranasda_products', parsed);
          } else {
            setProducts(INITIAL_PRODUCTS);
            await dbStorage.setItem('dekranasda_products', INITIAL_PRODUCTS);
          }
        }

        // 2. Artisans
        const cachedArtisans = await dbStorage.getItem<UMKM[]>('dekranasda_artisans');
        if (cachedArtisans) {
          setArtisans(cachedArtisans);
        } else {
          const savedArtisans = localStorage.getItem('dekranasda_artisans');
          if (savedArtisans) {
            const parsed = JSON.parse(savedArtisans);
            setArtisans(parsed);
            await dbStorage.setItem('dekranasda_artisans', parsed);
          } else {
            setArtisans(INITIAL_UMKM);
            await dbStorage.setItem('dekranasda_artisans', INITIAL_UMKM);
          }
        }

        // 3. News
        const cachedNews = await dbStorage.getItem<NewsItem[]>('dekranasda_news');
        if (cachedNews) {
          setNews(cachedNews);
        } else {
          const savedNews = localStorage.getItem('dekranasda_news');
          if (savedNews) {
            const parsed = JSON.parse(savedNews);
            setNews(parsed);
            await dbStorage.setItem('dekranasda_news', parsed);
          } else {
            setNews(INITIAL_NEWS);
            await dbStorage.setItem('dekranasda_news', INITIAL_NEWS);
          }
        }

        // 4. Cart
        const savedCart = localStorage.getItem('dekranasda_cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }

        // 5. Categories
        const cachedCategories = await dbStorage.getItem<Category[]>('dekranasda_categories');
        if (cachedCategories) {
          setCategories(cachedCategories);
        } else {
          const savedCategories = localStorage.getItem('dekranasda_categories');
          if (savedCategories) {
            const parsed = JSON.parse(savedCategories);
            setCategories(parsed);
            await dbStorage.setItem('dekranasda_categories', parsed);
          } else {
            setCategories(INITIAL_CATEGORIES);
            await dbStorage.setItem('dekranasda_categories', INITIAL_CATEGORIES);
          }
        }

        // 6. Settings
        const cachedSettings = await dbStorage.getItem<SystemSettings>('dekranasda_settings');
        if (cachedSettings) {
          setSettings(cachedSettings);
        } else {
          const savedSettings = localStorage.getItem('dekranasda_settings');
          if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            setSettings(parsed);
            await dbStorage.setItem('dekranasda_settings', parsed);
          } else {
            setSettings(INITIAL_SETTINGS);
            await dbStorage.setItem('dekranasda_settings', INITIAL_SETTINGS);
          }
        }

        // 7. Testimonials
        const cachedTestimonials = await dbStorage.getItem<Testimonial[]>('dekranasda_testimonials');
        if (cachedTestimonials) {
          setTestimonials(cachedTestimonials);
        } else {
          const savedTestimonials = localStorage.getItem('dekranasda_testimonials');
          if (savedTestimonials) {
            const parsed = JSON.parse(savedTestimonials);
            setTestimonials(parsed);
            await dbStorage.setItem('dekranasda_testimonials', parsed);
          } else {
            setTestimonials(INITIAL_TESTIMONIALS);
            await dbStorage.setItem('dekranasda_testimonials', INITIAL_TESTIMONIALS);
          }
        }
      } catch (err) {
        console.error('Failure initializing dbStorage data layers:', err);
      }
    };

    loadSavedData();
  }, []);

  // Sync state helpers to update storage engines dynamically
  const handleUpdateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    dbStorage.setItem('dekranasda_products', newProducts).catch(e => {
      console.error('Storage update failure for products:', e);
    });
  };

  const handleUpdateArtisans = (newArtisans: UMKM[]) => {
    setArtisans(newArtisans);
    dbStorage.setItem('dekranasda_artisans', newArtisans).catch(e => {
      console.error('Storage update failure for artisans:', e);
    });
  };

  const handleUpdateNews = (newNews: NewsItem[]) => {
    setNews(newNews);
    dbStorage.setItem('dekranasda_news', newNews).catch(e => {
      console.error('Storage update failure for news:', e);
    });
  };

  const handleUpdateCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    dbStorage.setItem('dekranasda_categories', newCategories).catch(e => {
      console.error('Storage update failure for categories:', e);
    });
  };

  const handleUpdateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    dbStorage.setItem('dekranasda_settings', newSettings).catch(e => {
      console.error('Storage update failure for settings:', e);
    });
  };

  const handleUpdateTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    dbStorage.setItem('dekranasda_testimonials', newTestimonials).catch(e => {
      console.error('Storage update failure for testimonials:', e);
    });
  };

  const handleSubmitTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testiForm.name.trim() || !testiForm.text.trim()) {
      alert('Mohon isi nama lengkap dan ulasan Anda.');
      return;
    }
    const defaultAvatars = [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150'
    ];
    const newTestimonial: Testimonial = {
      id: 'testi-' + Date.now(),
      name: testiForm.name,
      role: testiForm.role || 'Pelanggan',
      text: testiForm.text,
      rating: testiForm.rating,
      avatarUrl: defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)],
      images: testiForm.images || [],
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    handleUpdateTestimonials([newTestimonial, ...testimonials]);
    setTestiSubmitSuccess(true);
    setTimeout(() => {
      setTestiSubmitSuccess(false);
      setShowTestimonialModal(false);
      setTestiForm({ name: '', role: 'Pelanggan', text: '', rating: 5, images: [] });
    }, 3500);
  };

  // CART HANDLERS
  const handleAddToCart = (product: Product) => {
    const existingIndex = cartItems.findIndex(item => item.product.id === product.id);
    let updatedCart: CartItem[] = [];

    if (existingIndex > -1) {
      updatedCart = [...cartItems];
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart = [...cartItems, { product, quantity: 1 }];
    }

    setCartItems(updatedCart);
    localStorage.setItem('dekranasda_cart', JSON.stringify(updatedCart));
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    const updatedCart = cartItems.map(item => {
      if (item.product.id === productId) {
        const nextQty = item.quantity + delta;
        return { ...item, quantity: nextQty < 1 ? 1 : nextQty };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem('dekranasda_cart', JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.product.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('dekranasda_cart', JSON.stringify(updatedCart));
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem('dekranasda_cart');
  };

  // Jump triggers for custom deep navigation
  const navigateToCategory = (catId: string) => {
    setCatalogCategory(catId);
    setActiveTab('catalog');
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  // RESET CATALOG FILTERS
  const resetCatalogFilters = () => {
    setCatalogSearch('');
    setCatalogCategory('all');
    setCatalogStock('all');
    setCatalogMaxPrice(5000000);
  };

  // FILTERED CATALOG RESULTS LIST
  const filteredProducts = products.filter(p => {
    const matchSearch = 
      p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      (p.motifName && p.motifName.toLowerCase().includes(catalogSearch.toLowerCase())) ||
      p.umkmName.toLowerCase().includes(catalogSearch.toLowerCase());

    const matchCategory = catalogCategory === 'all' || p.categoryId === catalogCategory;
    const matchStock = catalogStock === 'all' || p.stockStatus === catalogStock;
    const matchPrice = p.price <= catalogMaxPrice;

    return matchSearch && matchCategory && matchStock && matchPrice;
  });

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans selection:bg-maroon-100 selection:text-maroon-900 leading-normal" id="applet-viewport">
      
      {/* ================= HEADER BAR ================= */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-maroon-100/50 z-40 shadow-xs header-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          
          {/* Organization Logo Brand */}
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
            id="brand-logo"
            title="Kembali Beranda"
          >
            {/* Geometric Red Maroon icon frame or Custom Logo representing Dekranasda */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white text-gold-400 font-accent font-extrabold flex items-center justify-center shadow-md relative overflow-hidden group-hover:bg-zinc-50 border border-maroon-100 transition-colors">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain p-0.5" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full bg-maroon-700 text-white flex items-center justify-center">
                  <span className="text-base sm:text-lg tracking-wider font-extrabold">{settings?.logoText || 'DM'}</span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gold-400" />
            </div>

            <div>
              <span className="block font-display font-bold text-sm sm:text-base text-zinc-900 tracking-tight leading-tight group-hover:text-maroon-700 transition-colors">
                {settings?.brandName || 'DEKRANASDA'}
              </span>
              <span className="block text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest font-accent font-bold">
                {settings?.brandSub || 'KAB. MANGGARAI, NTT'}
              </span>
            </div>
          </button>

          {/* DESKTOP TABS BAR */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs lg:text-sm font-accent font-semibold text-zinc-600">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'home' ? 'text-maroon-800 bg-maroon-50 font-bold' : 'hover:text-maroon-700 hover:bg-stone-50'
              }`}
              id="tab-home"
            >
              Beranda
            </button>
            
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'catalog' ? 'text-maroon-800 bg-maroon-50 font-bold' : 'hover:text-maroon-700 hover:bg-stone-50'
              }`}
              id="tab-catalog"
            >
              Katalog Digital
            </button>

            <button
              onClick={() => setActiveTab('artisans')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'artisans' ? 'text-maroon-800 bg-maroon-50 font-bold' : 'hover:text-maroon-700 hover:bg-stone-50'
              }`}
              id="tab-artisans"
            >
              Profil Pengrajin
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'news' ? 'text-maroon-800 bg-maroon-50 font-bold' : 'hover:text-maroon-700 hover:bg-stone-50'
              }`}
              id="tab-news"
            >
              Berita & Kegiatan
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'about' ? 'text-maroon-800 bg-maroon-50 font-bold' : 'hover:text-maroon-700 hover:bg-stone-50'
              }`}
              id="tab-about"
            >
              Sejarah & Struktur
            </button>

            <button
              onClick={() => setActiveTab('portal')}
              className={`px-4 py-2 border border-maroon-105 bg-maroon-50/55 hover:bg-maroon-100/40 text-maroon-850 text-xs font-bold rounded-xl transition cursor-pointer`}
              id="tab-portal"
            >
              Portal Internal
            </button>
          </nav>

          {/* CART TRIGGER BUTTON */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 sm:p-3 relative rounded-full bg-stone-50 hover:bg-maroon-50 hover:text-maroon-700 border border-zinc-150 transition-all cursor-pointer flex items-center justify-center group"
              id="btn-cart-trigger"
              title="Keranjang Belanja Tradisional"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700 group-hover:text-maroon-700" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-maroon-600 text-white font-accent font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* Mobile Menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full border border-zinc-150 text-zinc-700 hover:bg-stone-100 cursor-pointer"
              title="Buka menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* MOBILE MENU ACCORDION */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-100 bg-white/95 backdrop-blur-lg p-4 space-y-2 flex flex-col text-sm font-semibold text-zinc-700 animate-slide-down">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-left ${activeTab === 'home' ? 'bg-maroon-50 text-maroon-800' : ''}`}
            >
              Beranda
            </button>
            <button
              onClick={() => { setActiveTab('catalog'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-left ${activeTab === 'catalog' ? 'bg-maroon-50 text-maroon-800' : ''}`}
            >
              Katalog Digital
            </button>
            <button
              onClick={() => { setActiveTab('artisans'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-left ${activeTab === 'artisans' ? 'bg-maroon-50 text-maroon-800' : ''}`}
            >
              Profil Pengrajin
            </button>
            <button
              onClick={() => { setActiveTab('news'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-left ${activeTab === 'news' ? 'bg-maroon-50 text-maroon-800' : ''}`}
            >
              Berita & Kegiatan
            </button>
            <button
              onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-left ${activeTab === 'about' ? 'bg-maroon-50 text-maroon-800' : ''}`}
            >
              Sejarah & Struktur
            </button>
            <button
              onClick={() => { setActiveTab('portal'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-left border border-maroon-105 bg-maroon-50/50 text-maroon-850 text-xs`}
            >
              Portal Internal
            </button>
          </div>
        )}
      </header>


      {/* ================= MAIN CONTAINER BODY ================= */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* TAB 1: BERANDA / HOME VIEW */}
        {activeTab === 'home' && (
          <div className="space-y-16 animate-fade-in" id="home-dashboard-view">
            
            {/* Hero Section */}
            <HeaderBanner
              umkmCount={artisans.length}
              productCount={products.length}
              categoriesCount={categories.length}
              onExplore={() => setActiveTab('catalog')}
              settings={settings}
            />

            {/* Traditional philosophy teaser letter */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-songke-light rounded-3xl p-6 sm:p-10 border border-maroon-105">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-1.5 text-xs text-maroon-700 uppercase tracking-widest font-accent font-bold">
                  <Leaf className="w-4 h-4 text-maroon-600" />
                  Filosofi Tenun Songke Manggarai
                </div>

                <h2 className="text-xl sm:text-2xl font-display font-medium text-zinc-900 leading-snug">
                  {settings?.philosophyTitle || 'Sarung Tenun Adat Bermakna Filosofi Kosmologis'}
                </h2>

                <p className="text-zinc-600 text-sm font-light leading-relaxed whitespace-pre-wrap">
                  {settings?.philosophyContent || 'Bagi orang Flores Manggarai Barat, Manggarai, dan Manggarai Timur, kain tenun Songke wajib dikenakan saat ritual pemanggilan roh leluhur, perkawinan adat, dan tari tombak Caci. Setiap benang emas mewakili mata angin, tanda kesaksian mori karaeng, serta harapan melimpahnya hasil jagung meler di lingko sasi lodok.'}
                </p>

                <button
                  onClick={() => setActiveTab('about')}
                  className="text-maroon-750 font-accent font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5 hover:underline cursor-pointer"
                >
                  Pelajari Sejarah Selengkapnya
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="lg:col-span-4 relative rounded-2xl overflow-hidden pt-[56%] sm:pt-[45%] lg:pt-[100%]">
                <img
                  src={settings?.philosophyPhoto || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600"}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                  alt="Filosofi Tenun Songke Manggarai"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* CATEGORIES GRID BLOCK - Quick navigation triggers */}
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-display font-medium text-zinc-900">Kategori Kerajinan Khas</h2>
                <p className="text-zinc-500 text-xs sm:text-sm mt-1 max-w-lg mx-auto font-light leading-normal">
                  Pilih klasifikasi komoditas lokal binaan kami di bawah ini untuk melihat daftar karya terbaik segera.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {categories.map((cat) => {
                  const itemsCount = products.filter(p => p.categoryId === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => navigateToCategory(cat.id)}
                      className="group p-5 sm:p-6 bg-white border border-zinc-100 rounded-2xl text-left shadow-xs hover:shadow-md hover:border-maroon-200 hover:-translate-y-0.5 transition-all text-sm cursor-pointer"
                      id={`home-cat-tile-${cat.id}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-maroon-50 group-hover:bg-maroon-500 group-hover:text-white rounded-xl text-maroon-700 transition">
                          <Layers className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] uppercase font-bold text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded">
                          {itemsCount} item
                        </span>
                      </div>

                      <h3 className="font-display font-semibold text-zinc-90 w-full text-zinc-900 leading-snug group-hover:text-maroon-700">
                        {cat.name}
                      </h3>
                      
                      <p className="text-zinc-400 text-[11px] font-light mt-1.5 leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LATEST PRODUCTS SPOTLIGHT HIGHLIGHTS */}
            <div className="space-y-6">
              <div className="flex items-end justify-between gap-4 border-b border-zinc-100 pb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-medium text-zinc-900">Karya Unggulan Terbaru</h2>
                  <p className="text-zinc-500 text-xs sm:text-sm mt-1 font-light">Rilisan kerajinan orisinil penenun anyar binaan Kabupaten Manggarai.</p>
                </div>

                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-accent font-semibold rounded-xl tracking-tight transition inline-flex items-center gap-1 cursor-pointer"
                >
                  Semua Produk
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.filter(p => p.showOnHomepage !== false).slice(0, 4).map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onViewDetail={(prod) => setSelectedProduct(prod)}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>

            {/* RECENT PRESS RELEASES HEADLINES CARD */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
              <div className="lg:col-span-5 p-6 sm:p-10 bg-zinc-900 rounded-3xl text-white flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="px-3 py-1 bg-gold-400 text-black text-[10px] font-accent font-bold uppercase rounded-md tracking-wider">
                    Jadwal & Agenda
                  </span>
                  
                  <h3 className="text-xl sm:text-2xl font-display font-medium leading-snug text-white">
                    Penerbitan Produk Anyar Melalui Koperasi Daerah
                  </h3>
                  
                  <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                    Setiap bulan sekretariat kami menyelenggarakan verifikasi mutu kriya songke, anyaman, kopi dan souvenir di kantor Dekranasda Ruteng Flores demi menyaring produk binaan berdaya jual wisata. Hubungi administrasi kami apabila Anda memiliki UMKM yang belum terdaftar.
                  </p>
                </div>

                <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center text-xs mt-6">
                  <div>
                    <span className="block text-zinc-400">Saluran Konsultasi:</span>
                    <a href="mailto:info@dekranasdamanggarai.net" className="font-accent font-bold text-gold-400 hover:underline">
                      sekretariat@dekranasda-manggarai.go.id
                    </a>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4 flex flex-col justify-center">
                <h4 className="font-display font-medium text-base text-zinc-900 pb-2 border-b">
                  Berita Publikasi Terbaru:
                </h4>
                
                {news.slice(0, 2).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setSelectedProduct(null); setActiveTab('news'); }}
                    className="flex gap-4 p-4 rounded-2xl bg-white border border-stone-100 hover:border-maroon-100 hover:bg-maroon-50/10 text-left cursor-pointer transition w-full"
                  >
                    <img src={item.imageUrl} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" referrerPolicy="no-referrer" />
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-maroon-600 font-accent">
                        {item.category} / {item.date}
                      </span>
                      <h4 className="font-display font-semibold text-zinc-900 text-xs sm:text-sm line-clamp-1 mt-0.5">
                        {item.title}
                      </h4>
                      <p className="text-zinc-500 text-[11px] sm:text-xs line-clamp-1 font-light mt-1">
                        {item.excerpt}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* TESTIMONIALS & REVIEWS SECTION */}
            <div className="space-y-8 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-100 pb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-medium text-zinc-900">Testimoni & Apresiasi</h2>
                  <p className="text-zinc-500 text-xs sm:text-sm mt-1 font-light">Ulasan otentik dari pemesan kain Songke, anyaman bambu, dan kriya binaan.</p>
                </div>

                <button
                  onClick={() => setShowTestimonialModal(true)}
                  className="px-5 py-3 bg-maroon-800 hover:bg-maroon-900 text-white text-xs font-accent font-semibold rounded-xl tracking-tight transition inline-flex items-center gap-2 cursor-pointer shadow-md shadow-maroon-100 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <MessageSquare className="w-4 h-4 text-gold-450" />
                  Kirim Testimoni Anda
                </button>
              </div>

              {testimonials.filter(t => t.status === 'APPROVED').length === 0 ? (
                <div className="bg-stone-50 border border-stone-100 rounded-3xl p-8 text-center max-w-lg mx-auto">
                  <MessageSquare className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                  <p className="text-zinc-700 text-sm font-medium">Belum ada testimoni terverifikasi yang terpilih.</p>
                  <p className="text-zinc-400 text-xs font-light mt-1 mb-4">Jadilah yang pertama menceritakan ulasan atau pengalaman berbelanja Anda.</p>
                  <button
                    onClick={() => setShowTestimonialModal(true)}
                    className="px-4 py-2 bg-zinc-150 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition"
                  >
                    Kirim Sekarang
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonials.filter(t => t.status === 'APPROVED').map((item) => (
                    <div
                      key={item.id}
                      className="group bg-white p-6 rounded-2xl border border-zinc-100 shadow-xs hover:shadow-md hover:border-maroon-100 hover:-translate-y-0.5 transition-all text-sm flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex gap-1 text-gold-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < item.rating ? 'fill-gold-400 text-gold-400' : 'text-zinc-200'}`}
                            />
                          ))}
                        </div>
                        <p className="text-zinc-600 font-light italic leading-relaxed text-xs">
                          "{item.text}"
                        </p>

                        {/* Approved Showcase Photos */}
                        {item.images && item.images.length > 0 && (
                          <div className="flex gap-2 flex-wrap pt-1.5" id={`showcase-testi-${item.id}`}>
                            {item.images.map((imgSrc, imgIdx) => (
                              <button
                                key={imgIdx}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLightboxImage(imgSrc);
                                }}
                                className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-150 bg-stone-50 hover:border-maroon-400 cursor-pointer shadow-2xs hover:scale-105 active:scale-95 transition-all outline-none"
                                title="Klik untuk memperbesar foto"
                              >
                                <img
                                  src={imgSrc}
                                  className="w-full h-full object-cover"
                                  alt="Foto ulasan"
                                  referrerPolicy="no-referrer"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 pt-3 border-t border-zinc-50">
                        {item.avatarUrl ? (
                          <img
                            src={item.avatarUrl}
                            className="w-10 h-10 rounded-full object-cover border border-stone-100"
                            alt={item.name}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-maroon-50 text-maroon-850 flex items-center justify-center font-bold text-xs">
                            {item.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4 className="font-display font-bold text-zinc-900 leading-none">
                            {item.name}
                          </h4>
                          <span className="text-[10px] text-zinc-400 font-light block mt-1">
                            {item.role || 'Pelanggan'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}


        {/* TAB 2: CATALOG / GALERI PRODUK */}
        {activeTab === 'catalog' && (
          <div className="space-y-8 animate-fade-in" id="catalog-gallery-view">
            
            {/* Catalog Info introduction */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-medium text-zinc-900 flex items-center gap-2">
                <span className="w-1.5 h-8 bg-maroon-600 rounded-full" />
                Katalog Produk Kerajinan Daerah
              </h2>
              <p className="text-zinc-500 text-xs sm:text-sm mt-1 max-w-xl font-light">
                Gunakan panel penyaring kategori, kisaran harga, atau status persediaan untuk menemukan koleksi kerajinan premium binaan terbaik Dekranasda Kabupaten Manggarai.
              </p>
            </div>

            {/* DETAILED HORIZONTAL FILTERS & SIDEBAR PANEL CONTROLS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Sidebar Filters Sheet (3 columns) */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-zinc-200 p-5 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <h3 className="font-accent font-bold text-xs sm:text-sm text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-maroon-700" />
                    Filter Pencarian
                  </h3>
                  
                  <button
                    onClick={resetCatalogFilters}
                    className="text-xs text-maroon-650 text-maroon-600 hover:underline cursor-pointer flex items-center gap-1 font-medium bg-transparent"
                    title="Reset Filter"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Atur Ulang
                  </button>
                </div>

                {/* Filter : Type Search */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest font-accent">Nama & Keahlian</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-9 pr-3 py-2 border rounded-xl font-sans text-xs focus:ring-1 focus:ring-maroon-500 focus:border-maroon-500"
                      placeholder="Cari Tenun Jok, Kopi, Kencana..."
                      value={catalogSearch}
                      onChange={e => setCatalogSearch(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  </div>
                </div>

                {/* Filter : Category Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest font-accent">Kategori Komoditas</label>
                  <div className="space-y-1.5 flex flex-col text-xs text-zinc-650 text-zinc-600">
                    <button
                      onClick={() => setCatalogCategory('all')}
                      className={`py-1.5 px-2.5 rounded-lg text-left transition-all ${
                        catalogCategory === 'all' ? 'bg-maroon-50 text-maroon-800 font-bold' : 'hover:bg-zinc-50'
                      }`}
                    >
                      Semua Kategori ({products.length})
                    </button>
                    {categories.map(cat => {
                      const count = products.filter(p => p.categoryId === cat.id).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setCatalogCategory(cat.id)}
                          className={`py-1.5 px-2.5 rounded-lg text-left transition-all ${
                            catalogCategory === cat.id ? 'bg-maroon-50 text-maroon-800 font-bold' : 'hover:bg-zinc-50'
                          }`}
                        >
                          {cat.name} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Filter : Stock select dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest font-accent">Ketersediaan Stok</label>
                  <select
                    value={catalogStock}
                    onChange={e => setCatalogStock(e.target.value)}
                    className="w-full px-2.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-sans focus:ring-1 focus:ring-maroon-500"
                  >
                    <option value="all">Semua Persediaan</option>
                    <option value="Tersedia">Stok Tersedia</option>
                    <option value="Pre-Order">Sifatnya Pre-Order</option>
                    <option value="Habis">Habis Dipesan</option>
                  </select>
                </div>

                {/* Filter : Max Price slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-zinc-700 uppercase tracking-widest font-accent">Harga Maksimal</label>
                    <span className="font-bold text-maroon-700">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(catalogMaxPrice)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={5000000}
                    step={10000}
                    value={catalogMaxPrice}
                    onChange={(e) => setCatalogMaxPrice(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-maroon-700"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                    <span>Rp 10 rb</span>
                    <span>Rp 5 Juta</span>
                  </div>
                </div>
              </div>

              {/* Products Catalog Display Grid (9 columns) */}
              <div className="lg:col-span-9 space-y-6">
                
                {/* Search result count stats banner */}
                <div className="flex items-center justify-between text-xs text-zinc-400 font-accent bg-zinc-100/50 p-3 rounded-xl px-4 border">
                  <span>Ditemukan <strong>{filteredProducts.length}</strong> karya khas daerah</span>
                  {filteredProducts.length !== products.length && (
                    <span className="text-maroon-700 font-semibold italic">*Sinkronisasi data terverifikasi lokal</span>
                  )}
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20 p-8 bg-zinc-50 rounded-2xl border border-dashed border-zinc-250">
                    <Search className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <p className="text-zinc-500 text-sm font-medium">Karya yang Anda cari belum tersedia.</p>
                    <p className="text-zinc-400 text-xs mt-1">Coba atur ulang parameter filter atau perkecil kata kunci Anda.</p>
                    
                    <button
                      onClick={resetCatalogFilters}
                      className="mt-4 px-4 py-2 bg-maroon-600 hover:bg-maroon-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Buka Semua Katalog
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onViewDetail={(prod) => setSelectedProduct(prod)}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}


        {/* TAB 3: ARTISANS LIST DIRECTORY */}
        {activeTab === 'artisans' && (
          <ArtisanList
            artisans={artisans}
            allProducts={products}
            onViewProduct={(p) => setSelectedProduct(p)}
          />
        )}


        {/* TAB 4: PUBLISHED NEWS AND RELEASES */}
        {activeTab === 'news' && (
          <NewsSection news={news} onUpdateNews={handleUpdateNews} />
        )}


        {/* TAB 5: ABOUT SECTION */}
        {activeTab === 'about' && (
          <AboutSection settings={settings} />
        )}


        {/* TAB 6: AUTHENTICATED ADMINISTRATOR/UMKM DATABASE CONSOLE PANEL */}
        {activeTab === 'portal' && (
          <AdminPanel
            products={products}
            artisans={artisans}
            news={news}
            categories={categories}
            settings={settings}
            testimonials={testimonials}
            onUpdateProducts={handleUpdateProducts}
            onUpdateArtisans={handleUpdateArtisans}
            onUpdateNews={handleUpdateNews}
            onUpdateCategories={handleUpdateCategories}
            onUpdateSettings={handleUpdateSettings}
            onUpdateTestimonials={handleUpdateTestimonials}
          />
        )}

      </main>


      {/* ================= GLOBAL FLOATING MODALS OVERLAYS ================= */}
      
      {/* 1. PRODUCT DETAIL MODAL SCREEN */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          artisan={artisans.find((a) => a.id === selectedProduct.umkmId)}
          allProducts={products}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onSelectProduct={(p) => setSelectedProduct(p)} // Swap product details in-place
        />
      )}

      {/* 1.5 USER TESTIMONIAL SUBMISSION FORM MODAL */}
      {showTestimonialModal && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 relative border border-zinc-150 animate-fade-in">
            <button
              onClick={() => {
                setShowTestimonialModal(false);
                setTestiForm({ name: '', role: 'Pelanggan', text: '', rating: 5, images: [] });
              }}
              className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-650 rounded-full hover:bg-zinc-100 transition cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {testiSubmitSuccess ? (
              <div className="flex flex-col items-center text-center gap-4 py-8 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-650 rounded-full flex items-center justify-center animate-bounce">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="font-display font-medium text-xl text-zinc-900 leading-snug">
                  Testimoni Terkirim!
                </h3>
                <p className="text-zinc-500 font-light text-sm max-w-sm leading-relaxed">
                  Terima kasih banyak atas apresiasi Anda. Demi menjaga keamanan publikasi, ulasan Anda akan dikurasi dan disaring oleh administrator terlebih dahulu sebelum ditayangkan di halaman utama.
                </p>
                <div className="text-xs text-maroon-700 font-medium bg-maroon-50/60 px-4 py-1.5 rounded-full mt-2 animate-pulse">
                  Menyimpan ke antrean moderasi...
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitTestimonial} className="space-y-5">
                <div>
                  <h3 className="font-display font-medium text-xl text-zinc-900">
                    Kirim Testimoni Baru
                  </h3>
                  <p className="text-zinc-400 font-light text-xs mt-1 leading-normal">
                    Bantu kami menceritakan kisah kriya adat Manggarai dengan ulasan otentik Anda.
                  </p>
                </div>

                <div className="space-y-4 text-xs font-accent">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-zinc-700 block">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Maria Indah"
                        value={testiForm.name}
                        onChange={(e) => setTestiForm({ ...testiForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-500/20 focus:border-maroon-500 text-sm transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-zinc-700 block">Peran / Profesi</label>
                      <input
                        type="text"
                        placeholder="Contoh: Kolektor Seni / Wisatawan"
                        value={testiForm.role}
                        onChange={(e) => setTestiForm({ ...testiForm, role: e.target.value })}
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-500/20 focus:border-maroon-500 text-sm transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-semibold text-zinc-700 block">Penilaian Anda *</label>
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((starNum) => (
                          <button
                            key={starNum}
                            type="button"
                            onClick={() => setTestiForm({ ...testiForm, rating: starNum })}
                            className="p-1 hover:scale-115 transition cursor-pointer"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                starNum <= testiForm.rating
                                  ? 'fill-gold-400 text-gold-400'
                                  : 'text-zinc-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-zinc-500 text-xs font-semibold ml-2">
                        ({testiForm.rating} dari 5 Bintang)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-700 block">Tulis Testimoni / Ulasan *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Bagikan rasa bangga Anda atas kain songke, anyaman atau pelayanan pengrajin di Manggarai..."
                      value={testiForm.text}
                      onChange={(e) => setTestiForm({ ...testiForm, text: e.target.value })}
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-500/20 focus:border-maroon-500 text-sm transition"
                    />
                  </div>

                  <div className="space-y-1.5 bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100">
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-zinc-700 block">Foto Pengalaman / Kriya Anda (Maks. 3 Foto) *</label>
                      <span className="text-[10px] text-zinc-450">Format JPG/PNG (Maks. 2MB/foto)</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {testiForm.images && testiForm.images.map((imgSrc, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl border border-zinc-200 overflow-hidden bg-white shadow-xs group">
                          <img src={imgSrc} className="w-full h-full object-cover" alt={`Preview ${idx + 1}`} />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = testiForm.images.filter((_, i) => i !== idx);
                              setTestiForm({ ...testiForm, images: updated });
                            }}
                            className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition shadow-md cursor-pointer"
                            title="Hapus foto ini"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {(!testiForm.images || testiForm.images.length < 3) && (
                        <label className="aspect-square border-2 border-dashed border-zinc-200 hover:border-maroon-300 hover:bg-maroon-50/10 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition text-zinc-400 hover:text-maroon-805">
                          <ImageIcon className="w-5 h-5 text-zinc-450" />
                          <span className="text-[10px] font-semibold text-center block">Upload Foto</span>
                          <span className="text-[9px] text-zinc-400 font-light block">({testiForm.images ? testiForm.images.length : 0}/3)</span>
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (!files) return;
                              const fileList = Array.from(files) as File[];
                              const limit = 3 - (testiForm.images ? testiForm.images.length : 0);
                              const toProcess = fileList.slice(0, limit);

                              toProcess.forEach((file) => {
                                if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                                  alert(`Format "${file.name}" tidak didukung. Mohon upload format JPG atau PNG.`);
                                  return;
                                }
                                if (file.size > 2 * 1024 * 1024) {
                                  alert(`Ukuran berkas "${file.name}" terlalu besar (Kira-kira ${Math.round(file.size / 1024 / 1025)}MB). Maksimal batas ukuran adalah 2MB.`);
                                  return;
                                }

                                const reader = new FileReader();
                                reader.onload = (evt) => {
                                  if (evt.target && typeof evt.target.result === 'string') {
                                    setTestiForm(prev => ({
                                      ...prev,
                                      images: [...(prev.images || []), evt.target.result as string]
                                    }));
                                  }
                                };
                                reader.readAsDataURL(file);
                              });
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 text-xs pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTestimonialModal(false);
                      setTestiForm({ name: '', role: 'Pelanggan', text: '', rating: 5, images: [] });
                    }}
                    className="px-4 py-2 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-xl cursor-pointer font-semibold transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-white rounded-xl cursor-pointer font-bold transition flex items-center gap-1.5 shadow-md shadow-maroon-50"
                  >
                    Kirim ke Moderasi
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. SHOPPING CART DRAWER PANEL */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        whatsappNumber={settings?.whatsappNumber}
      />


      {/* ================= FOOTER COMPONENT ================= */}
      <footer className="bg-zinc-900 text-stone-200 pt-16 pb-12 border-t-4 border-maroon-700 font-sans z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white text-white font-accent font-bold flex items-center justify-center border-b-2 border-gold-400 overflow-hidden border border-zinc-700">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain p-0.5" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-maroon-700 flex items-center justify-center text-stone-150">
                    {settings?.logoText || 'DM'}
                  </div>
                )}
              </div>
              <span className="font-display font-bold text-sm sm:text-base text-white tracking-wide">
                {settings?.brandName || 'DEKRANASDA'} {settings?.brandSub || 'KAB. MANGGARAI'}
              </span>
            </div>

            <p className="text-zinc-400 text-xs font-light leading-relaxed">
              {settings?.footerGreeting || 'Koleksi resmi katalog digital terverifikasi Dewan Kerajinan Adat Nasional Daerah, memfasilitasi kemitraan niaga kerajinan khas Flores, Nusa Tenggara Timur secara global.'}
            </p>

            <span className="block text-[10px] text-zinc-500 font-mono">
              Server Time: {new Date().toLocaleDateString('id-ID')} - Flores, NTT
            </span>

            {/* Social media connections */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="text-xs text-zinc-400 hover:text-rose-450 transition" title="Instagram">Instagram</a>
              )}
              {settings?.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="text-xs text-zinc-400 hover:text-blue-400 transition" title="Facebook">Facebook</a>
              )}
              {settings?.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" rel="noreferrer" className="text-xs text-zinc-400 hover:text-red-500 transition" title="YouTube">YouTube</a>
              )}
            </div>
          </div>

          {/* Col 2: Hubungi Kami kontak */}
          <div>
            <h4 className="font-accent font-bold text-xs uppercase tracking-wider text-white mb-4">Hubungi Hubungan</h4>
            <ul className="text-zinc-400 text-xs space-y-2.5 font-light">
              <li className="flex items-center gap-1.5 hover:text-white transition text-xs">
                <MapPin className="w-4 h-4 text-maroon-600 flex-shrink-0" />
                <a href={settings?.googleMapsUrl || 'https://maps.google.com/?q=Avenida+Komodo+No.+10,+Ruteng,+Flores,+NTT'} target="_blank" rel="noreferrer" className="hover:underline select-all">Ruteng, Flores, NTT (Peta)</a>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition text-xs">
                <Phone className="w-4 h-4 text-maroon-600 flex-shrink-0" />
                <a href={`https://wa.me/${settings?.whatsappNumber?.replace(/[^0-9]/g, '') || '6281234567890'}`} target="_blank" rel="noreferrer" className="hover:underline">WhatsApp: {settings?.whatsappNumber || '+62 812-3456-7890'}</a>
              </li>
              <li className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-maroon-600 flex-shrink-0" />
                <span>Pusat Kerajinan Songke & Anyaman Re'a</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Link Tab navigasi */}
          <div>
            <h4 className="font-accent font-bold text-xs uppercase tracking-wider text-white mb-4">Akses Navigasi</h4>
            <div className="grid grid-cols-2 gap-2 text-zinc-400 text-xs font-light">
              <button onClick={() => setActiveTab('home')} className="hover:text-gold-400 transition text-left cursor-pointer">Beranda</button>
              <button onClick={() => setActiveTab('catalog')} className="hover:text-gold-400 transition text-left cursor-pointer">Katalog</button>
              <button onClick={() => setActiveTab('artisans')} className="hover:text-gold-400 transition text-left cursor-pointer">Pengrajin</button>
              <button onClick={() => setActiveTab('news')} className="hover:text-gold-400 transition text-left cursor-pointer">Kegiatan</button>
              <button onClick={() => setActiveTab('about')} className="hover:text-gold-400 transition text-left cursor-pointer">Sejarah</button>
              <button onClick={() => setActiveTab('portal')} className="hover:text-gold-400 transition text-left cursor-pointer">Portal Admin</button>
            </div>
          </div>

          {/* Col 4: Pembinaan UMKM info */}
          <div className="space-y-4">
            <h4 className="font-accent font-bold text-xs uppercase tracking-wider text-white mb-4">Inklusi Seni Flores</h4>
            <p className="text-zinc-400 text-xs font-light leading-relaxed">
              Dukungan digital Anda membantu keberlangsungan sekolah penenun lokal wanita serta melestarikan motif kuno yang sarat makna filosofis keluhuran hidup.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-maroon-900 border border-maroon-800 rounded-full text-[10px] font-accent text-rose-300">
              <Award className="w-3.5 h-3.5 text-gold-500" />
              Dewan Kerajinan Nasional – NTT
            </div>
          </div>

        </div>

        {/* Copywrite bottom bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-xs font-light">
          <p>© {new Date().getFullYear()} Dekranasda Kabupaten Manggarai. Semua Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="text-[10px] text-zinc-650 mt-1">Situs Katalog Resmi didesain dengan visual Suku Manggarai (Wela Runu / Songke motifs).</p>
        </div>
      </footer>

      {/* 3. LIGHTBOX FOR TESTIMONIAL PHOTO PREVIEWS */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-70 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full transition cursor-pointer"
              title="Tutup Pratinjau"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={lightboxImage} 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/5 bg-zinc-950" 
              alt="Pratinjau Foto Ulasan" 
              referrerPolicy="no-referrer"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

    </div>
  );
}
