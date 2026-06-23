import React, { useState, useEffect } from 'react';
import { Product, UMKM, NewsItem, CategoryId, Category, SystemUser, SystemSettings, Testimonial } from '../types';
import { 
  Lock, LayoutDashboard, Palette, Users, FileText, Plus, Edit3, Trash2, 
  BarChart3, RefreshCw, Download, Printer, LogIn, LogOut, CheckCircle, 
  X, Image as ImageIcon, DollarSign, Smartphone, MessageSquare, Award, Star,
  Settings, Shield, Key, Eye, EyeOff, BookOpen, TrendingUp, Package, Check, Leaf
} from 'lucide-react';
import ImageUploadInput from './ImageUploadInput';
import { INITIAL_USERS } from '../data/initialData';

interface AdminPanelProps {
  products: Product[];
  artisans: UMKM[];
  news: NewsItem[];
  categories: Category[];
  settings: SystemSettings;
  testimonials: Testimonial[];
  onUpdateProducts: (newProducts: Product[]) => void;
  onUpdateArtisans: (newArtisans: UMKM[]) => void;
  onUpdateNews: (newNews: NewsItem[]) => void;
  onUpdateCategories: (newCategories: Category[]) => void;
  onUpdateSettings: (newSettings: SystemSettings) => void;
  onUpdateTestimonials: (newTestimonials: Testimonial[]) => void;
}

type PanelView = 'stats' | 'products' | 'artisans' | 'news' | 'users' | 'settings' | 'sales' | 'stock' | 'testimonials';
type UserRole = 'ADMIN' | 'UMKM' | 'EDITOR' | 'GUEST';


export default function AdminPanel({
  products,
  artisans,
  news,
  categories,
  settings,
  testimonials = [],
  onUpdateProducts,
  onUpdateArtisans,
  onUpdateNews,
  onUpdateCategories,
  onUpdateSettings,
  onUpdateTestimonials,
}: AdminPanelProps) {
  // Authentication states
  const [role, setRole] = useState<UserRole>('GUEST');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);

  // Lockout countdown timer for brute force prevention
  useEffect(() => {
    if (lockoutTimeLeft > 0) {
      const timer = setInterval(() => {
        setLockoutTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTimeLeft]);
  
  // Tab states inside panel
  const [activeView, setActiveView] = useState<PanelView>('stats');

  // Dynamic user data states
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<SystemUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'UMKM' as 'ADMIN' | 'UMKM' | 'EDITOR',
    umkmId: '',
    status: 'Aktif' as 'Aktif' | 'Nonaktif'
  });

  // Dynamic system settings form state
  const [settingsForm, setSettingsForm] = useState<SystemSettings>({ ...settings });
  
  // Dynamic categories creator form state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    description: '',
    icon: 'Layers'
  });

  // Password visibility flag for user list table audit
  const [showUserPassword, setShowUserPassword] = useState<{ [key: string]: boolean }>({});

  // Sync internal settings form if props change
  useEffect(() => {
    setSettingsForm({ ...settings });
  }, [settings]);

  // Load / Persist users database
  useEffect(() => {
    const saved = localStorage.getItem('dekranasda_users');
    if (saved) {
      setSystemUsers(JSON.parse(saved));
    } else {
      localStorage.setItem('dekranasda_users', JSON.stringify(INITIAL_USERS));
      setSystemUsers(INITIAL_USERS);
    }
  }, []);

  const saveUsersToStorage = (updatedUsers: SystemUser[]) => {
    setSystemUsers(updatedUsers);
    localStorage.setItem('dekranasda_users', JSON.stringify(updatedUsers));
  };

  // State structure for the stock ledger
  interface StockLedgerItem {
    productId: string;
    productName: string;
    initialStock: number;
    stockIn: number;
    stockOut: number;
    soldCount: number;
    currentStock: number;
    location: string;
    lastUpdated: string;
  }
  
  const [stockLedger, setStockLedger] = useState<StockLedgerItem[]>([]);

  // Load and synchronize stock database with products
  useEffect(() => {
    const saved = localStorage.getItem('dekranasda_stock_ledger');
    if (saved) {
      const parsed = JSON.parse(saved) as StockLedgerItem[];
      // Sync names and detect new items
      let isChanged = false;
      const synced = parsed.map(item => {
        const matchingProduct = products.find(p => p.id === item.productId);
        if (matchingProduct && matchingProduct.name !== item.productName) {
          isChanged = true;
          return { ...item, productName: matchingProduct.name };
        }
        return item;
      });

      // Add missing ones
      products.forEach(p => {
        if (!synced.some(item => item.productId === p.id)) {
          const init = p.stockStatus === 'Habis' ? 0 : 20;
          const sold = Math.floor(p.views / 25) + 1;
          const sIn = 5;
          const sOut = 1;
          const sisa = p.stockStatus === 'Habis' ? 0 : Math.max(0, init + sIn - sOut - sold);
          
          synced.push({
            productId: p.id,
            productName: p.name,
            initialStock: init,
            stockIn: sIn,
            stockOut: sOut,
            soldCount: sold,
            currentStock: sisa,
            location: 'Sentra Dekranasda Ruteng',
            lastUpdated: new Date().toISOString().split('T')[0]
          });
          isChanged = true;
        }
      });

      if (isChanged || parsed.length !== synced.length) {
        setStockLedger(synced);
        localStorage.setItem('dekranasda_stock_ledger', JSON.stringify(synced));
      } else {
        setStockLedger(parsed);
      }
    } else {
      // Seed initial ledger based on existing props.products
      const seededLedger = products.map((p, idx) => {
        const init = p.stockStatus === 'Habis' ? 0 : (18 + (idx * 4) % 15);
        const sold = Math.floor(p.views / (20 + idx)) + (idx % 3) + 1;
        const stockIn = 8 + (idx * 2) % 10;
        const stockOut = 1 + idx % 4;
        const sisa = p.stockStatus === 'Habis' ? 0 : Math.max(0, init + stockIn - stockOut - sold);
        const storageLocations = [
          'Sentra Dekranasda Ruteng',
          'Workshop Tenun Satar Lenda',
          'Bengkel Anyaman Re\'a Lalong',
          'Gudang Kopi Colol, Lambaleda',
          'Sentra Tenun Cibal, NTT'
        ];
        return {
          productId: p.id,
          productName: p.name,
          initialStock: init,
          stockIn: stockIn,
          stockOut: stockOut,
          soldCount: sold,
          currentStock: sisa,
          location: storageLocations[idx % storageLocations.length],
          lastUpdated: new Date(p.createdAt || Date.now()).toISOString().split('T')[0]
        };
      });
      setStockLedger(seededLedger);
      localStorage.setItem('dekranasda_stock_ledger', JSON.stringify(seededLedger));
    }
  }, [products]);

  const updateLedgerItem = (productId: string, updatedFields: Partial<StockLedgerItem>) => {
    const updated = stockLedger.map(item => {
      if (item.productId === productId) {
        const newItem = { ...item, ...updatedFields };
        // Recalculate Sisa Stok/currentStock dynamically
        newItem.currentStock = Math.max(0, newItem.initialStock + newItem.stockIn - newItem.stockOut - newItem.soldCount);
        newItem.lastUpdated = new Date().toISOString().split('T')[0];
        
        // Also keep product catalog's stockStatus aligned!
        const productToUpdate = products.find(p => p.id === productId);
        if (productToUpdate) {
          let nextStatus: 'Tersedia' | 'Pre-Order' | 'Habis' = 'Tersedia';
          if (newItem.currentStock === 0) {
            nextStatus = 'Habis';
          } else if (productToUpdate.stockStatus === 'Habis') {
            nextStatus = 'Tersedia';
          } else {
            nextStatus = productToUpdate.stockStatus;
          }
          
          if (productToUpdate.stockStatus !== nextStatus) {
            // Trigger parent product status change
            const updatedProducts = products.map(p => p.id === productId ? { ...p, stockStatus: nextStatus } : p);
            onUpdateProducts(updatedProducts);
          }
        }
        return newItem;
      }
      return item;
    });
    setStockLedger(updated);
    localStorage.setItem('dekranasda_stock_ledger', JSON.stringify(updated));
  };
  
  // Form states (Add/Edit)
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [showArtisanModal, setShowArtisanModal] = useState(false);
  const [editingArtisan, setEditingArtisan] = useState<UMKM | null>(null);

  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  // Testimonial Moderation Panel States
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testiFilterStatus, setTestiFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  // Custom Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'product' | 'artisan' | 'news' | 'user' | 'category' | 'testimonial';
    id: string;
    message: string;
    submessage?: string;
  } | null>(null);

  const executeDelete = () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    
    if (type === 'product') {
      const updatedProducts = products.filter(p => p.id !== id);
      onUpdateProducts(updatedProducts);
      // Clean up stock ledger as well
      const updatedLedger = stockLedger.filter(item => item.productId !== id);
      setStockLedger(updatedLedger);
      localStorage.setItem('dekranasda_stock_ledger', JSON.stringify(updatedLedger));
    } else if (type === 'artisan') {
      onUpdateArtisans(artisans.filter(a => a.id !== id));
    } else if (type === 'news') {
      onUpdateNews(news.filter(n => n.id !== id));
    } else if (type === 'user') {
      const updated = systemUsers.filter(u => u.id !== id);
      saveUsersToStorage(updated);
    } else if (type === 'category') {
      onUpdateCategories(categories.filter(c => c.id !== id));
    } else if (type === 'testimonial') {
      onUpdateTestimonials(testimonials.filter(t => t.id !== id));
    }
    
    setDeleteTarget(null);
  };

  // States for sales charts and stock ledger filters
  const [salesChartPeriod, setSalesChartPeriod] = useState<'harian' | 'bulanan' | 'tahunan'>('bulanan');
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [stockCategoryFilter, setStockCategoryFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [selectedStockItem, setSelectedStockItem] = useState<StockLedgerItem | null>(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockForm, setStockForm] = useState({
    productId: '',
    productName: '',
    initialStock: 0,
    stockIn: 0,
    stockOut: 0,
    soldCount: 0,
    location: '',
  });

  // Filter products by artisan if logged in as UMKM (umkm-1)
  const loggedInUmkmId = 'umkm-1'; // Demo UMKM owner maria Din's store

  // New product form states
  const [prodForm, setProdForm] = useState({
    name: '',
    categoryId: 'tenun' as CategoryId,
    umkmId: 'umkm-1',
    description: '',
    materials: '',
    size: '',
    price: 0,
    isPricePublic: true,
    stockStatus: 'Tersedia' as 'Tersedia' | 'Pre-Order' | 'Habis',
    imageUrl: '',
    motifName: '',
    galleryUrls: [] as string[],
    showOnHomepage: true,
  });

  // New artisan form states
  const [artForm, setArtForm] = useState({
    name: '',
    owner: '',
    category: 'Tenun Ikat & Songke',
    address: '',
    village: '',
    subdistrict: 'Langke Rembong',
    phone: '',
    description: '',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=85&w=200&h=200',
    rating: 4.8,
    established: '2026',
  });

  // New news article form states
  const [newsForm, setNewsForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Kegiatan' as 'Kegiatan' | 'Pelatihan' | 'Pameran' | 'Pengumuman',
    imageUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=800',
    images: [] as string[],
    author: 'Humas Dekranasda'
  });

  const openEditStock = (item: StockLedgerItem) => {
    setSelectedStockItem(item);
    setStockForm({
      productId: item.productId,
      productName: item.productName,
      initialStock: item.initialStock,
      stockIn: item.stockIn,
      stockOut: item.stockOut,
      soldCount: item.soldCount,
      location: item.location,
    });
    setShowStockModal(true);
  };

  const saveStockData = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStockItem) {
      updateLedgerItem(selectedStockItem.productId, {
        initialStock: stockForm.initialStock,
        stockIn: stockForm.stockIn,
        stockOut: stockForm.stockOut,
        soldCount: stockForm.soldCount,
        location: stockForm.location,
      });
      setShowStockModal(false);
      setSelectedStockItem(null);
    }
  };

  // Handle Logins with high-security protection (brute force protection & generic secure warnings)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lockoutTimeLeft > 0) {
      setErrorMsg(`Akses dinonaktifkan sementara. Silakan tunggu ${lockoutTimeLeft} detik demi keamanan sistem.`);
      return;
    }

    const foundUser = systemUsers.find(
      u => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (foundUser) {
      if (foundUser.status === 'Nonaktif') {
        setErrorMsg('Akun Anda dinonaktifkan oleh administrator. Silakan hubungi pusat bantuan.');
        return;
      }
      setRole(foundUser.role);
      setLoggedInUser(foundUser);
      setErrorMsg('');
      setFailedAttempts(0); // reset on success
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      
      if (nextAttempts >= 5) {
        setLockoutTimeLeft(30); // 30 seconds lockout
        setErrorMsg('Terlalu banyak percobaan masuk yang gagal. Login dikunci selama 30 detik untuk keamanan.');
      } else {
        setErrorMsg(`Kredensial keamanan tidak cocok. Sisa percobaan: ${5 - nextAttempts}.`);
      }
    }
  };

  const autofillAdmin = () => {
    const adminUser = systemUsers.find(u => u.role === 'ADMIN');
    if (adminUser) {
      setEmail(adminUser.email);
      setPassword(adminUser.password || 'admin123');
    } else {
      setEmail('admin@dekranasda.id');
      setPassword('admin123');
    }
  };

  const autofillUmkm = () => {
    const umkmUser = systemUsers.find(u => u.role === 'UMKM');
    if (umkmUser) {
      setEmail(umkmUser.email);
      setPassword(umkmUser.password || 'umkm123');
    } else {
      setEmail('umkm@manggarai.net');
      setPassword('umkm123');
    }
  };

  const handleLogout = () => {
    setRole('GUEST');
    setLoggedInUser(null);
    setEmail('');
    setPassword('');
  };

  // PRODUCT CRUD MANAGERS
  const openAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      categoryId: 'tenun',
      umkmId: role === 'UMKM' ? loggedInUmkmId : artisans[0]?.id || 'umkm-1',
      description: '',
      materials: '',
      size: '',
      price: 0,
      isPricePublic: true,
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&q=80&w=800',
      motifName: '',
      galleryUrls: [] as string[],
      showOnHomepage: true,
    });
    setShowProductModal(true);
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdForm({
      name: prod.name,
      categoryId: prod.categoryId as CategoryId,
      umkmId: prod.umkmId,
      description: prod.description,
      materials: prod.materials,
      size: prod.size,
      price: prod.price,
      isPricePublic: prod.isPricePublic,
      stockStatus: prod.stockStatus,
      imageUrl: prod.imageUrl,
      motifName: prod.motifName || '',
      galleryUrls: prod.galleryUrls || [],
      showOnHomepage: prod.showOnHomepage !== false,
    });
    setShowProductModal(true);
  };

  const saveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    const catObject = categories.find(c => c.id === prodForm.categoryId);
    const umkmObject = artisans.find(u => u.id === prodForm.umkmId);

    if (editingProduct) {
      // Modify
      const updated = products.map(p => p.id === editingProduct.id ? {
        ...p,
        name: prodForm.name,
        categoryId: prodForm.categoryId,
        categoryName: catObject?.name || 'Lainnya',
        umkmId: prodForm.umkmId,
        umkmName: umkmObject?.name || 'Pengrajin Lokal',
        description: prodForm.description,
        materials: prodForm.materials,
        size: prodForm.size,
        price: prodForm.price,
        isPricePublic: prodForm.isPricePublic,
        stockStatus: prodForm.stockStatus,
        imageUrl: prodForm.imageUrl,
        motifName: prodForm.motifName,
        galleryUrls: prodForm.galleryUrls || [],
        showOnHomepage: prodForm.showOnHomepage !== false,
      } : p);
      onUpdateProducts(updated);
    } else {
      // Create new
      const newPr: Product = {
        id: `prod-${Date.now()}`,
        name: prodForm.name,
        categoryId: prodForm.categoryId,
        categoryName: catObject?.name || 'Lainnya',
        umkmId: prodForm.umkmId,
        umkmName: umkmObject?.name || 'Pengrajin Lokal',
        description: prodForm.description,
        materials: prodForm.materials,
        size: prodForm.size,
        price: prodForm.price,
        isPricePublic: prodForm.isPricePublic,
        stockStatus: prodForm.stockStatus,
        imageUrl: prodForm.imageUrl || 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&q=80&w=800',
        galleryUrls: prodForm.galleryUrls || [],
        motifName: prodForm.motifName,
        rating: 4.8,
        views: 1,
        createdAt: new Date().toISOString(),
        showOnHomepage: prodForm.showOnHomepage !== false,
      };
      onUpdateProducts([newPr, ...products]);
    }
    setShowProductModal(false);
  };

  const deleteProduct = (id: string) => {
    if (role !== 'ADMIN') {
      alert('Hak akses ditolak. Hanya administrator yang dapat menghapus produk.');
      return;
    }
    const prod = products.find(p => p.id === id);
    setDeleteTarget({
      type: 'product',
      id,
      message: 'Hapus Produk Katalog',
      submessage: `Apakah Anda yakin ingin menghapus produk "${prod?.name || id}" secara permanen dari katalog sistem? Tindakan ini tidak dapat dibatalkan.`
    });
  };


  // ARTISAN CRUD MANAGERS
  const openAddArtisan = () => {
    setEditingArtisan(null);
    setArtForm({
      name: '',
      owner: '',
      category: 'Tenun Ikat & Songke',
      address: '',
      village: '',
      subdistrict: 'Langke Rembong',
      phone: '628',
      description: '',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=85&w=200&h=200',
      rating: 4.8,
      established: '2026',
    });
    setShowArtisanModal(true);
  };

  const openEditArtisan = (art: UMKM) => {
    setEditingArtisan(art);
    setArtForm({
      name: art.name,
      owner: art.owner,
      category: art.category,
      address: art.address,
      village: art.village,
      subdistrict: art.subdistrict,
      phone: art.phone,
      description: art.description,
      avatar: art.avatar,
      rating: art.rating,
      established: art.established,
    });
    setShowArtisanModal(true);
  };

  const saveArtisan = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArtisan) {
      const updatedArr = artisans.map(a => a.id === editingArtisan.id ? {
        ...a,
        name: artForm.name,
        owner: artForm.owner,
        category: artForm.category,
        address: artForm.address,
        village: artForm.village,
        subdistrict: artForm.subdistrict,
        phone: artForm.phone,
        description: artForm.description,
        avatar: artForm.avatar,
        rating: artForm.rating,
        established: artForm.established
      } : a);
      onUpdateArtisans(updatedArr);
    } else {
      const newArt: UMKM = {
        id: `umkm-${Date.now()}`,
        name: artForm.name,
        owner: artForm.owner,
        category: artForm.category,
        address: artForm.address,
        village: artForm.village,
        subdistrict: artForm.subdistrict,
        phone: artForm.phone,
        description: artForm.description,
        avatar: artForm.avatar,
        rating: artForm.rating,
        established: artForm.established,
        featured: false
      };
      onUpdateArtisans([...artisans, newArt]);
    }
    setShowArtisanModal(false);
  };

  const deleteArtisan = (id: string) => {
    if (role !== 'ADMIN') {
      alert('Hak akses ditolak. Hanya administrator yang dapat menghapus pengrajin.');
      return;
    }
    const art = artisans.find(a => a.id === id);
    setDeleteTarget({
      type: 'artisan',
      id,
      message: 'Hapus Pengrajin Binaan',
      submessage: `Apakah Anda yakin ingin menghapus pengrajin "${art?.name || id}" secara permanen? Menghapus pengrajin juga akan memutus data kaitan produk mereka di katalog.`
    });
  };


  // NEWS CRUD MANAGERS
  const openAddNews = () => {
    setEditingNews(null);
    setNewsForm({
      title: '',
      excerpt: '',
      content: '',
      category: 'Kegiatan',
      imageUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=800',
      images: [],
      author: 'Humas Dekranasda'
    });
    setShowNewsModal(true);
  };

  const openEditNews = (n: NewsItem) => {
    setEditingNews(n);
    setNewsForm({
      title: n.title,
      excerpt: n.excerpt,
      content: n.content,
      category: n.category,
      imageUrl: n.imageUrl,
      images: n.images || [],
      author: n.author
    });
    setShowNewsModal(true);
  };

  const saveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNews) {
      const updated = news.map(n => n.id === editingNews.id ? {
        ...n,
        title: newsForm.title,
        excerpt: newsForm.excerpt,
        content: newsForm.content,
        category: newsForm.category,
        imageUrl: newsForm.imageUrl,
        images: newsForm.images,
        author: newsForm.author
      } : n);
      onUpdateNews(updated);
    } else {
      const newAr: NewsItem = {
        id: `news-${Date.now()}`,
        title: newsForm.title,
        excerpt: newsForm.excerpt,
        content: newsForm.content,
        date: new Date().toISOString().split('T')[0],
        category: newsForm.category,
        imageUrl: newsForm.imageUrl,
        images: newsForm.images,
        author: newsForm.author,
        likes: 0,
        dislikes: 0
      };
      onUpdateNews([newAr, ...news]);
    }
    setShowNewsModal(false);
  };

  const deleteNews = (id: string) => {
    if (role !== 'ADMIN') {
      alert('Hak akses ditolak. Hanya administrator yang dapat menghapus artikel.');
      return;
    }
    const item = news.find(n => n.id === id);
    setDeleteTarget({
      type: 'news',
      id,
      message: 'Hapus Berita/Kabar Dekranasda',
      submessage: `Apakah Anda yakin ingin menghapus kabar berjudul "${item?.title || id}" secara permanen? Publikasi artikel ini akan dihapus.`
    });
  };


  // EXPORTER UTIL (CSV)
  const handleExportCSV = () => {
    // Generate CSV data of products
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'ID Produk,Nama Produk,Kategori,Nama UMKM,Bahan,Ukuran,Harga,Stok\n';
    
    products.forEach(p => {
      const priceVal = p.price;
      const cleanName = p.name.replace(/,/g, ';');
      const cleanUmkm = p.umkmName.replace(/,/g, ';');
      csvContent += `${p.id},"${cleanName}","${p.categoryName}","${cleanUmkm}","${p.materials}","${p.size}",${priceVal},"${p.stockStatus}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Katalog_Dekranasda_Manggarai_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // EXPORTER PRINT PREVIEW LAYOUT (PDF-style)
  const handleTriggerPrint = () => {
    window.print();
  };

  // SVG-based Categories distribution metrics calculator for bar chart
  const categoryCounts = categories.map(cat => {
    const count = products.filter(p => p.categoryId === cat.id).length;
    return { name: cat.name, code: cat.id, count };
  });

  const maxCount = Math.max(...categoryCounts.map(c => c.count), 1);

  // Filter items in view based on role permission
  const visibleProducts = role === 'UMKM' 
    ? products.filter(p => p.umkmId === loggedInUmkmId)
    : products;

  // USER MANAGEMENT HANDLERS
  const openAddUser = () => {
    setEditingUser(null);
    setUserForm({
      name: '',
      email: '',
      password: '',
      role: 'UMKM',
      umkmId: artisans[0]?.id || '',
      status: 'Aktif'
    });
    setShowUserModal(true);
  };

  const openEditUser = (user: SystemUser) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: user.password || '',
      role: user.role,
      umkmId: user.umkmId || '',
      status: user.status
    });
    setShowUserModal(true);
  };

  const saveUserObj = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const updated = systemUsers.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...userForm }
          : u
      );
      saveUsersToStorage(updated);
    } else {
      const newUser: SystemUser = {
        id: 'user-' + Date.now(),
        ...userForm
      };
      saveUsersToStorage([...systemUsers, newUser]);
    }
    setShowUserModal(false);
  };

  const deleteUser = (userId: string) => {
    if (role !== 'ADMIN') {
      alert('Hak akses ditolak. Hanya administrator yang dapat mengelola pengguna.');
      return;
    }
    if (userId === loggedInUser?.id) {
      alert('Anda tidak bisa menghapus akun Anda sendiri saat sedang masuk!');
      return;
    }
    const usr = systemUsers.find(u => u.id === userId);
    setDeleteTarget({
      type: 'user',
      id: userId,
      message: 'Hapus Pengguna Sistem',
      submessage: `Apakah Anda yakin ingin menghapus pengguna "${usr?.name || userId}" secara permanen dari sistem? Pengelola ini tidak akan dapat masuk kembali.`
    });
  };

  // CATEGORY MANAGEMENT HANDLERS
  const openAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      id: '',
      name: '',
      description: '',
      icon: 'Layers'
    });
    setShowCategoryModal(true);
  };

  const openEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryForm({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      icon: cat.icon
    });
    setShowCategoryModal(true);
  };

  const saveCategoryObj = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      const updated = categories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, name: categoryForm.name, description: categoryForm.description, icon: categoryForm.icon }
          : c
      );
      onUpdateCategories(updated);
    } else {
      const cid = categoryForm.id.toLowerCase().replace(/\s+/g, '-').trim() || 'cat-' + Date.now();
      const newCat: Category = {
        id: cid,
        name: categoryForm.name,
        description: categoryForm.description,
        icon: categoryForm.icon
      };
      onUpdateCategories([...categories, newCat]);
    }
    setShowCategoryModal(false);
  };

  const deleteCategory = (catId: string) => {
    if (role !== 'ADMIN') {
      alert('Hak akses ditolak. Hanya administrator yang dapat menghapus kategori.');
      return;
    }
    const cat = categories.find(c => c.id === catId);
    setDeleteTarget({
      type: 'category',
      id: catId,
      message: 'Hapus Kategori Produk',
      submessage: `Apakah Anda yakin ingin menghapus kategori "${cat?.name || catId}" secara permanen? Produk dengan kategori terkait mungkin perlu disesuaikan kembali.`
    });
  };

  // GENERAL APP SETTINGS SUBMIT HANDLER
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    alert('Konfigurasi sistem berhasil diperbarui secara optimal!');
  };

  // TESTIMONIAL MODERATION MUTATORS
  const handleApproveTestimonial = (id: string) => {
    const updated = testimonials.map(t => t.id === id ? { ...t, status: 'APPROVED' as const } : t);
    onUpdateTestimonials(updated);
  };

  const handleRejectTestimonial = (id: string) => {
    const updated = testimonials.map(t => t.id === id ? { ...t, status: 'REJECTED' as const } : t);
    onUpdateTestimonials(updated);
  };

  const handleSaveEditTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    const updated = testimonials.map(t => t.id === editingTestimonial.id ? editingTestimonial : t);
    onUpdateTestimonials(updated);
    setEditingTestimonial(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-zinc-150 shadow-sm p-6 sm:p-10" id="portal-dashboard">
      
      {/* 1. GUEST Screen (Login block) */}
      {role === 'GUEST' && (
        <div className="max-w-md mx-auto py-12 px-4 text-center space-y-6">
          <div className="w-16 h-16 bg-maroon-50 rounded-2xl flex items-center justify-center text-maroon-700 mx-auto border border-maroon-100">
            <Lock className="w-8 h-8 text-maroon-800" />
          </div>

          <div>
            <h2 className="text-2xl font-display font-medium text-zinc-900 leading-tight">
              Portal Pengrajin & Admin
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1 font-light">
              Gunakan akun resmi Dekranasda Kabupaten Manggarai atau akun UMKM binaan terdaftar untuk mengelola katalog produk daerah secara privat dan aman.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-accent font-bold text-zinc-700 uppercase mb-1">Alamat Email</label>
              <input
                type="email"
                required
                placeholder="misal: admin@dekranasda.id"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl focus:border-maroon-500 text-sm shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                id="login-email"
                disabled={lockoutTimeLeft > 0}
              />
            </div>

            <div>
              <label className="block text-xs font-accent font-bold text-zinc-700 uppercase mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-2.5 bg-white border border-zinc-200 rounded-xl focus:border-maroon-500 text-sm shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  id="login-password"
                  disabled={lockoutTimeLeft > 0}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 transition cursor-pointer"
                  title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-650 bg-red-50 p-2.5 rounded-lg font-medium border border-red-100">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={lockoutTimeLeft > 0}
              className="w-full py-3 bg-maroon-700 hover:bg-maroon-800 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-accent font-semibold rounded-xl text-xs sm:text-sm shadow-md cursor-pointer transition-colors"
              id="btn-login"
            >
              {lockoutTimeLeft > 0 ? `Sistem Terkunci (${lockoutTimeLeft}s)` : 'Autentikasi Sekarang'}
            </button>
          </form>

        </div>
      )}


      {/* 2. AUTHENTICATED SYSTEM BOARD */}
      {role !== 'GUEST' && (
        <div className="space-y-8 font-sans">
          
          {/* Dashboard Title Header */}
          <div className="bg-songke-pattern rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="z-10 space-y-1.5">
              <span className="px-2.5 py-1 rounded-full bg-gold-400 text-black text-[10px] font-accent font-bold uppercase tracking-wider">
                Hak Akses: {role} Portal
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-medium text-white leading-tight">
                {role === 'ADMIN' ? 'Dashboard Manajer Dekranasda' : `Sistem Kelola Karya - ${artisans.find(a=>a.id===loggedInUmkmId)?.name || 'UMKM Binaan'}`}
              </h2>
              <p className="text-maroon-150 text-xs sm:text-sm font-light">
                {role === 'ADMIN' ? 'Mengatur basis data produk secara universal, registrasi kelompok pengrajin, dan kabar kabupaten.' : 'Tambahkan produk anyar, pantau kunjungan karya, dan sunting data verifikasi WhatsApp usaha.'}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="z-10 self-start md:self-auto inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white hover:text-gold-400 text-xs font-accent font-medium rounded-xl border border-white/20 transition-all cursor-pointer"
              id="btn-logout"
            >
              <LogOut className="w-4 h-4" />
              Keluar Sesi
            </button>
          </div>

          {/* Sub Navigation controls within Dashboard */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-150 pb-4">
            <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setActiveView('stats')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-accent font-semibold inline-flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                  activeView === 'stats' ? 'bg-maroon-800 text-white' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Analisis & Grafik
              </button>

              <button
                onClick={() => setActiveView('products')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-accent font-semibold inline-flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                  activeView === 'products' ? 'bg-maroon-800 text-white' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                }`}
              >
                <Palette className="w-4 h-4" />
                Kelola Produk ({visibleProducts.length})
              </button>

              <button
                onClick={() => setActiveView('sales')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-accent font-semibold inline-flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                  activeView === 'sales' ? 'bg-maroon-800 text-white' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Dashboard Penjualan
              </button>

              <button
                onClick={() => setActiveView('stock')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-accent font-semibold inline-flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                  activeView === 'stock' ? 'bg-maroon-800 text-white' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                }`}
              >
                <Package className="w-4 h-4" />
                Manajemen Stok
              </button>

              {(role === 'ADMIN' || role === 'EDITOR') && (
                <>
                  <button
                    onClick={() => setActiveView('artisans')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-accent font-semibold inline-flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                      activeView === 'artisans' ? 'bg-maroon-800 text-white' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Manajemen Pengrajin ({artisans.length})
                  </button>

                  <button
                    onClick={() => setActiveView('news')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-accent font-semibold inline-flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                      activeView === 'news' ? 'bg-maroon-800 text-white' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Kabar & Pengumuman ({news.length})
                  </button>

                  <button
                    onClick={() => setActiveView('testimonials')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-accent font-semibold inline-flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                      activeView === 'testimonials' ? 'bg-maroon-800 text-white' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Moderasi Testimoni ({testimonials.filter(t => t.status === 'PENDING').length} Baru)
                  </button>

                  {role === 'ADMIN' && (
                    <>
                      <button
                        onClick={() => setActiveView('users')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-accent font-semibold inline-flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                          activeView === 'users' ? 'bg-maroon-800 text-white' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                        }`}
                      >
                        <Shield className="w-4 h-4" />
                        Manajemen User ({systemUsers.length})
                      </button>

                      <button
                        onClick={() => setActiveView('settings')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-accent font-semibold inline-flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                          activeView === 'settings' ? 'bg-maroon-800 text-white' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                        }`}
                      >
                        <Settings className="w-4 h-4" />
                        Pengaturan
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Quick action exporters */}
            <div className="flex gap-2 text-xs">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 font-medium rounded-xl inline-flex items-center gap-1 transition cursor-pointer"
                title="Ekspor ke spreadsheet Excel"
              >
                <Download className="w-3.5 h-3.5 text-maroon-600" />
                Ekspor Excel (CSV)
              </button>

              <button
                onClick={handleTriggerPrint}
                className="px-3.5 py-2 border border-zinc-205 text-zinc-700 bg-white hover:bg-zinc-50 font-medium rounded-xl inline-flex items-center gap-1 transition cursor-pointer"
                title="Cetak Laporan Rapi PDF"
              >
                <Printer className="w-3.5 h-3.5 text-maroon-600" />
                Cetak PDF
              </button>
            </div>
          </div>


          {/* VIEW A: STATS & DYNAMIC GRAPHS */}
          {activeView === 'stats' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-stone-50 border border-zinc-150 p-5 rounded-2xl">
                  <span className="text-zinc-400 block text-xs font-accent">Total Produk Terdaftar</span>
                  <p className="text-3xl font-bold font-accent text-zinc-90 w-full mt-1">
                    {visibleProducts.length} <span className="text-xs text-zinc-400 font-light">item</span>
                  </p>
                </div>

                <div className="bg-stone-50 border border-zinc-150 p-5 rounded-2xl">
                  <span className="text-zinc-400 block text-xs font-accent">Estimasi Nilai Aset</span>
                  <p className="text-2xl font-bold font-accent text-zinc-90 w-full mt-1.5 text-maroon-900">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(
                      visibleProducts.reduce((acc, p) => acc + p.price, 0)
                    )}
                  </p>
                </div>

                <div className="bg-stone-50 border border-zinc-150 p-5 rounded-2xl">
                  <span className="text-zinc-400 block text-xs font-accent">Total Pengunjung Website</span>
                  <p className="text-3xl font-bold font-accent text-zinc-90 w-full mt-1">
                    {visibleProducts.reduce((acc, p) => acc + p.views, 1205)} <span className="text-xs text-zinc-400 font-light">klik</span>
                  </p>
                </div>

                <div className="bg-stone-50 border border-zinc-150 p-5 rounded-2xl">
                  <span className="text-zinc-400 block text-xs font-accent">Rerata Rating Ulasan</span>
                  <p className="text-3xl font-bold font-accent text-zinc-90 w-full mt-1 text-gold-600 flex items-center gap-1.5">
                    <Star className="w-6 h-6 fill-gold-500 text-gold-500" />
                    4.85
                  </p>
                </div>
              </div>

              {/* DYNAMIC METRIC CHARTS BAR (Laporan jumlah produk per kategori) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* SVG Bar Chart for Products per Category */}
                <div className="lg:col-span-2 border border-zinc-150 rounded-2xl p-6 bg-white space-y-4">
                  <div>
                    <h3 className="font-display font-medium text-base text-zinc-900">
                      Grafik Laporan Jumlah Produk per Kategori
                    </h3>
                    <p className="text-zinc-400 text-xs font-light">Distribusi karya nyata UMKM binaan aktif Dekranasda Manggarai</p>
                  </div>

                  {/* CUSTOM INTEGRATED SVG CHART (Responsive & High Fidelity) */}
                  <div className="space-y-3.5 pt-3">
                    {categoryCounts.map((cat, index) => {
                      const perc = Math.round((cat.count / maxCount) * 100);
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-zinc-805 text-zinc-700">{cat.name}</span>
                            <span className="font-bold text-maroon-700">{cat.count} Produk ({perc}%)</span>
                          </div>
                          <div className="w-full bg-zinc-100 rounded-full h-3 overflow-hidden flex">
                            <div 
                              className="bg-maroon-600 h-full rounded-full transition-all duration-1000"
                              style={{ width: `${perc || 4}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Regional/Craftsman list breakdown */}
                <div className="border border-zinc-150 rounded-2xl p-6 bg-white space-y-4">
                  <div>
                    <h3 className="font-display font-medium text-base text-zinc-900">Sebaran Pengrajin</h3>
                    <p className="text-zinc-400 text-xs font-light">Asal wilayah penenun & pembuat bambu</p>
                  </div>

                  <div className="divide-y divide-zinc-100">
                    {artisans.slice(0, 5).map((art, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img src={art.avatar} className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <p className="font-medium text-zinc-800 line-clamp-1">{art.name}</p>
                            <p className="text-[10px] text-zinc-400">Kec. {art.subdistrict}</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-zinc-100 font-bold text-zinc-650">
                          {products.filter(p => p.umkmId === art.id).length} item
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-zinc-400 leading-normal italic text-center pt-2">
                    *Kopi difokuskan di dataran tinggi Lembah Colol, Anyaman Re'a di Lelak, Tenun Ikat di Ruteng Pitak.
                  </p>
                </div>

              </div>
            </div>
          )}


          {/* VIEW B: PRODUCTS CRUD DATABASE */}
          {activeView === 'products' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-medium text-base text-zinc-900">Daftar Buku Karya Katalog</h3>
                  <p className="text-zinc-400 text-xs font-light">Tambah barang baru, kelola harga, dan ganti ketersediaan stok.</p>
                </div>
                
                <button
                  onClick={openAddProduct}
                  className="px-4 py-2 bg-maroon-700 hover:bg-maroon-800 text-white text-xs sm:text-sm font-accent font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                  id="btn-add-product"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Karya Baru
                </button>
              </div>

              {/* Table spreadsheet style layout */}
              <div className="overflow-x-auto border border-zinc-150 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-stone-50 border-b border-zinc-150 font-bold text-zinc-700 uppercase tracking-wider text-[10px] select-none">
                    <tr>
                      <th className="p-4">Karya</th>
                      <th className="p-4">Kategori / Motif</th>
                      <th className="p-4">Pengrajin</th>
                      <th className="p-4 text-right">Harga</th>
                      <th className="p-4">Status Stok</th>
                      <th className="p-4 text-center">Tindakan</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-zinc-150 text-zinc-700">
                    {visibleProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-450 italic">
                          Belum ada entri produk terdaftar untuk akun ini.
                        </td>
                      </tr>
                    ) : (
                      visibleProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-zinc-50/50">
                          <td className="p-4 flex items-center gap-3">
                            <img src={p.imageUrl} className="w-10 h-10 rounded-lg object-cover border" referrerPolicy="no-referrer" />
                            <div>
                              <p className="font-semibold text-zinc-900 line-clamp-1">{p.name}</p>
                              <p className="text-[10px] text-zinc-400 lowercase">ID: {p.id}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-medium">{p.categoryName}</p>
                            <p className="text-[10px] text-maroon-700 font-mono italic">{p.motifName || '-'}</p>
                          </td>
                          <td className="p-4 text-zinc-550">{p.umkmName}</td>
                          <td className="p-4 text-right font-semibold text-zinc-900">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p.price)}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.stockStatus === 'Tersedia' ? 'bg-emerald-50 text-emerald-800' :
                              p.stockStatus === 'Pre-Order' ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-800'
                            }`}>
                              {p.stockStatus}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditProduct(p)}
                                className="p-1 px-2.5 rounded-lg bg-zinc-100 hover:bg-maroon-100 hover:text-maroon-700 cursor-pointer"
                                title="Edit entri"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteProduct(p.id)}
                                className={`p-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                                  role === 'ADMIN'
                                    ? 'bg-zinc-100 hover:bg-red-100 hover:text-red-700 text-zinc-600'
                                    : 'bg-zinc-100/50 text-zinc-300 hover:bg-red-50 hover:text-red-500 hover:border-red-200 border border-transparent'
                                }`}
                                title={role === 'ADMIN' ? 'Hapus entri' : 'Hanya Admin yang dapat menghapus entri ini'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* VIEW C: ARTISANS DIRECTORY CRUD (ADMIN ONLY) */}
          {activeView === 'artisans' && role === 'ADMIN' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-medium text-base text-zinc-900">Registrasi UMKM Binaan</h3>
                  <p className="text-zinc-400 text-xs font-light">Hubungkan pilar kelompok anyaman lokal ke portal promosi agar mereka mendapat paparan luar daerah.</p>
                </div>
                
                <button
                  onClick={openAddArtisan}
                  className="px-4 py-2 bg-maroon-700 hover:bg-maroon-800 text-white text-xs sm:text-sm font-accent font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                  id="btn-add-artisan"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Pengrajin Baru
                </button>
              </div>

              {/* Table of artisans */}
              <div className="overflow-x-auto border border-zinc-150 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-stone-50 border-b border-zinc-150 font-bold text-zinc-700 uppercase tracking-wider text-[10px] select-none">
                    <tr>
                      <th className="p-4">Brand Pengrajin</th>
                      <th className="p-4">Pemilik Usaha</th>
                      <th className="p-4">Keahlian</th>
                      <th className="p-4">Wilayah Lokasi</th>
                      <th className="p-4">HP WhatsApp</th>
                      <th className="p-4 text-center">Tindakan</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-zinc-150 text-zinc-700">
                    {artisans.map((art) => (
                      <tr key={art.id} className="hover:bg-zinc-50/50">
                        <td className="p-4 flex items-center gap-3">
                          <img src={art.avatar} className="w-9 h-9 rounded-full object-cover border" referrerPolicy="no-referrer" />
                          <p className="font-semibold text-zinc-900">{art.name}</p>
                        </td>
                        <td className="p-4 text-zinc-800">{art.owner}</td>
                        <td className="p-4 font-mono text-[10px] text-maroon-750 font-semibold">{art.category}</td>
                        <td className="p-4">
                          <p className="font-medium">Kec. {art.subdistrict}</p>
                          <p className="text-[10px] text-zinc-405 text-zinc-400">Desa {art.village}</p>
                        </td>
                        <td className="p-4 font-mono">{art.phone}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditArtisan(art)}
                              className="p-1 px-2.5 rounded-lg bg-zinc-100 hover:bg-maroon-100 hover:text-maroon-700 cursor-pointer"
                              title="Edit Pengrajin"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteArtisan(art.id)}
                              className={`p-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                                role === 'ADMIN'
                                  ? 'bg-zinc-100 hover:bg-red-100 hover:text-red-700 text-zinc-600'
                                  : 'bg-zinc-100/50 text-zinc-300 hover:bg-red-50 hover:text-red-500 hover:border-red-200 border border-transparent'
                              }`}
                              title={role === 'ADMIN' ? 'Hapus' : 'Hanya Admin yang dapat menghapus pengrajin'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* VIEW D: NEWS & EVENTS CRUD (ADMIN ONLY) */}
          {activeView === 'news' && role === 'ADMIN' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-medium text-base text-zinc-900">Publikasi Publik Berita & Kegiatan</h3>
                  <p className="text-zinc-400 text-xs font-light">Diseminasi berita pelatihan, foto dokumentasi festival, serta pengumuman kementrian setempat.</p>
                </div>
                
                <button
                  onClick={openAddNews}
                  className="px-4 py-2 bg-maroon-700 hover:bg-maroon-800 text-white text-xs sm:text-sm font-accent font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                  id="btn-add-news"
                >
                  <Plus className="w-4 h-4" />
                  Tulis Artikel/Berita
                </button>
              </div>

              {/* Table of news */}
              <div className="overflow-x-auto border border-zinc-150 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-stone-50 border-b border-zinc-150 font-bold text-zinc-700 uppercase tracking-wider text-[10px] select-none">
                    <tr>
                      <th className="p-4">Foto Banner</th>
                      <th className="p-4">Judul Artikel</th>
                      <th className="p-4">Kategori Kabar</th>
                      <th className="p-4">Tanggal Rilis</th>
                      <th className="p-4">Rilis Oleh</th>
                      <th className="p-4 text-center">Tindakan</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-zinc-150 text-zinc-700">
                    {news.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50/50">
                        <td className="p-4">
                          <img src={item.imageUrl} className="w-16 h-10 rounded-md object-cover border" referrerPolicy="no-referrer" />
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-zinc-900 line-clamp-1">{item.title}</p>
                          <p className="text-[10px] text-zinc-400">{item.excerpt.slice(0, 48)}...</p>
                        </td>
                        <td className="p-4 text-maroon-750 font-semibold">{item.category}</td>
                        <td className="p-4 font-mono">{item.date}</td>
                        <td className="p-4">{item.author}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditNews(item)}
                              className="p-1 px-2.5 rounded-lg bg-zinc-100 hover:bg-maroon-100 hover:text-maroon-700 cursor-pointer"
                              title="Sunting berita"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteNews(item.id)}
                              className={`p-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                                role === 'ADMIN'
                                  ? 'bg-zinc-100 hover:bg-red-100 hover:text-red-700 text-zinc-650'
                                  : 'bg-zinc-100/50 text-zinc-300 hover:bg-red-50 hover:text-red-500 hover:border-red-200 border border-transparent'
                              }`}
                              title={role === 'ADMIN' ? 'Hapus' : 'Hanya Admin yang dapat menghapus artikel'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* VIEW: DASHBOARD PENJUALAN */}
          {activeView === 'sales' && (
            <div className="space-y-8 animate-fade-in" id="sales-dashboard-section">
              <div>
                <h3 className="font-display font-medium text-lg text-zinc-900">Dashboard Penjualan Dekranasda</h3>
                <p className="text-zinc-500 text-xs font-light">Ringkasan transaksi, produk terlaris, dan diagram performa hasil kerajinan daerah lokal</p>
              </div>

              {/* STATS DECK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
                <div className="bg-stone-50 border border-zinc-150 p-5 rounded-2xl">
                  <span className="text-zinc-400 block text-[10px] font-accent font-bold uppercase tracking-wider">Total Produk Terjual</span>
                  <p className="text-3xl font-bold font-accent text-zinc-900 mt-1 flex items-baseline gap-1">
                    {stockLedger.reduce((sum, item) => sum + item.soldCount, 0)} <span className="text-xs text-zinc-400 font-normal">unit</span>
                  </p>
                  <span className="text-[10px] text-emerald-600 block mt-1">↑ 14% dari bulan lalu</span>
                </div>

                <div className="bg-stone-50 border border-zinc-150 p-5 rounded-2xl">
                  <span className="text-zinc-400 block text-[10px] font-accent font-bold uppercase tracking-wider">Total Stok Tersedia</span>
                  <p className="text-3xl font-bold font-accent text-zinc-900 mt-1 flex items-baseline gap-1">
                    {stockLedger.reduce((sum, item) => sum + item.currentStock, 0)} <span className="text-xs text-zinc-400 font-normal">item</span>
                  </p>
                  <span className="text-[10px] text-zinc-400 block mt-1">Tersebar di 5 titik sentra</span>
                </div>

                <div className="bg-stone-50 border border-zinc-150 p-5 rounded-2xl">
                  <span className="text-zinc-400 block text-[10px] font-accent font-bold uppercase tracking-wider">Total Nilai Penjualan</span>
                  <p className="text-2xl font-bold font-accent text-emerald-600 mt-1">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(
                      stockLedger.reduce((sum, item) => {
                        const matchingPrice = products.find(p => p.id === item.productId)?.price || 0;
                        return sum + (item.soldCount * matchingPrice);
                      }, 0)
                    )}
                  </p>
                  <span className="text-[10px] text-emerald-600 block mt-1">Estimasi omset kelompok</span>
                </div>

                <div className="bg-stone-50 border border-zinc-150 p-5 rounded-2xl">
                  <span className="text-zinc-400 block text-[10px] font-accent font-bold uppercase tracking-wider">Sistem UMKM & Keaktifan</span>
                  <p className="text-3xl font-bold font-accent text-maroon-900 mt-1 flex items-baseline gap-1">
                    {artisans.length} <span className="text-xs text-zinc-400 font-normal">pengrajin</span>
                  </p>
                  <span className="text-[10px] text-zinc-400 block mt-1">Semua status terverifikasi</span>
                </div>
              </div>

              {/* AUXILIARY KEY METRICS ROW */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 bg-zinc-50 border border-zinc-150 p-4.5 rounded-2xl text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center font-bold text-sm">
                    {stockLedger.filter(item => item.currentStock <= 5 && item.currentStock > 0).length}
                  </div>
                  <div>
                    <h5 className="font-bold text-zinc-800">Produk Hampir Habis</h5>
                    <p className="text-[11px] text-zinc-500">Stok kritis dibawah 5 unit</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold text-sm">
                    {stockLedger.filter(item => item.currentStock === 0).length}
                  </div>
                  <div>
                    <h5 className="font-bold text-zinc-800">Stok Kosong / Habis</h5>
                    <p className="text-[11px] text-zinc-500">Status tayang catalog adalah Habis</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm">
                    {products.filter(p => p.showOnHomepage === false).length}
                  </div>
                  <div>
                    <h5 className="font-bold text-zinc-800">Produk Sembunyi / Tidak Aktif</h5>
                    <p className="text-[11px] text-zinc-500">Karya tidak ditampilkan di beranada</p>
                  </div>
                </div>
              </div>

              {/* DIAGRAMS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* INTERACTIVE SALES FLOW CHART (MAIN) */}
                <div className="lg:col-span-2 bg-white border border-zinc-150 rounded-2xl p-6 shadow-xs space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h4 className="font-display font-medium text-zinc-900 flex items-center gap-2">
                        <TrendingUp className="w-4.5 h-4.5 text-maroon-700" />
                        Grafik Penjualan Harian, Bulanan, dan Tahunan
                      </h4>
                      <p className="text-xs text-zinc-400">Tampilan tren produk terjual secara berkala</p>
                    </div>

                    <div className="flex bg-zinc-100 rounded-xl p-1 gap-1 text-[11px] font-accent font-bold self-start">
                      {(['harian', 'bulanan', 'tahunan'] as const).map((period) => (
                        <button
                          key={period}
                          type="button"
                          onClick={() => setSalesChartPeriod(period)}
                          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                            salesChartPeriod === period ? 'bg-white text-maroon-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                          }`}
                        >
                          {period === 'harian' ? 'Harian' : period === 'bulanan' ? 'Bulanan' : 'Tahunan'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CUSTOM INTEGRATED STICKY BARS CHART */}
                  <div className="pt-4 h-64 flex items-end justify-between gap-3 min-h-[220px] select-none">
                    {salesChartPeriod === 'harian' && [
                      { label: 'Sen', val: 12 },
                      { label: 'Sel', val: 19 },
                      { label: 'Rab', val: 15 },
                      { label: 'Kam', val: 28 },
                      { label: 'Jum', val: 35 },
                      { label: 'Sab', val: 42 },
                      { label: 'Min', val: 24 },
                    ].map((item, idx) => {
                      const maxVal = 45;
                      const ratio = Math.max(10, Math.round((item.val / maxVal) * 100));
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group min-w-[30px]">
                          <span className="text-[9px] font-mono font-bold text-maroon-700 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-100 px-1 rounded">
                            {item.val}u
                          </span>
                          <div className="w-full bg-zinc-50 border border-zinc-100 rounded-lg flex items-end overflow-hidden h-36">
                            <div
                              className="w-full bg-maroon-600 group-hover:bg-maroon-700 transition-all rounded-t-md cursor-pointer"
                              style={{ height: `${ratio}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-medium text-zinc-500 text-center">{item.label}</span>
                        </div>
                      );
                    })}

                    {salesChartPeriod === 'bulanan' && [
                      { label: 'Jan', val: 45 },
                      { label: 'Feb', val: 56 },
                      { label: 'Mar', val: 72 },
                      { label: 'Apr', val: 68 },
                      { label: 'Mei', val: 89 },
                      { label: 'Jun', val: 104 },
                      { label: 'Jul', val: 115 },
                      { label: 'Ags', val: 98 },
                      { label: 'Sep', val: 122 },
                      { label: 'Okt', val: 135 },
                      { label: 'Nov', val: 150 },
                      { label: 'Des', val: 178 },
                    ].map((item, idx) => {
                      const maxVal = 180;
                      const ratio = Math.max(10, Math.round((item.val / maxVal) * 100));
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group min-w-[20px]">
                          <span className="text-[8px] font-mono font-bold text-maroon-700 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-100 px-0.5 rounded">
                            {item.val}
                          </span>
                          <div className="w-full bg-zinc-50 border border-zinc-100 rounded-md flex items-end overflow-hidden h-36">
                            <div
                              className="w-full bg-maroon-600 group-hover:bg-maroon-700 transition-all rounded-t-md cursor-pointer"
                              style={{ height: `${ratio}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-zinc-400 text-center">{item.label}</span>
                        </div>
                      );
                    })}

                    {salesChartPeriod === 'tahunan' && [
                      { label: 'Laporan 2024', val: 780 },
                      { label: 'Laporan 2025', val: 1120 },
                      { label: 'Laporan 2026', val: 1422 },
                    ].map((item, idx) => {
                      const maxVal = 1500;
                      const ratio = Math.max(10, Math.round((item.val / maxVal) * 100));
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group min-w-[60px]">
                          <span className="text-[10px] font-mono font-bold text-maroon-700 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-100 px-2 rounded">
                            {item.val} unit
                          </span>
                          <div className="w-1/3 bg-zinc-50 border border-zinc-100 rounded-lg flex items-end overflow-hidden h-36">
                            <div
                              className="w-full bg-maroon-600 group-hover:bg-maroon-700 transition-all rounded-t-md cursor-pointer"
                              style={{ height: `${ratio}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-zinc-500 text-center">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* GRAPH PRODUCTS BEST SELLERS */}
                <div className="bg-white border border-zinc-150 rounded-2xl p-6 shadow-xs space-y-5">
                  <div>
                    <h4 className="font-display font-medium text-zinc-900 flex items-center gap-2">
                      <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
                      Grafik Produk Terlaris
                    </h4>
                    <p className="text-xs text-zinc-400">Peringkat 5 produk dengan terjual terbanyak</p>
                  </div>

                  <div className="space-y-4 pt-1">
                    {[...stockLedger]
                      .sort((a,b) => b.soldCount - a.soldCount)
                      .slice(0, 5)
                      .map((item, idx) => {
                        const maxSoldCount = Math.max(5, [...stockLedger].sort((a,b) => b.soldCount - a.soldCount)[0]?.soldCount || 10);
                        const percentage = Math.round((item.soldCount / maxSoldCount) * 100);
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-zinc-700 font-medium truncate max-w-[155px]">
                                #{idx+1} {item.productName}
                              </span>
                              <span className="font-bold text-maroon-700 font-mono">{item.soldCount} Terjual</span>
                            </div>
                            <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden flex">
                              <div
                                className="bg-maroon-600 h-full rounded-full transition-all duration-1000"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

              </div>
            </div>
          )}


          {/* VIEW: MANAJEMEN STOK */}
          {activeView === 'stock' && (
            <div className="space-y-6 animate-fade-in" id="stock-management-section">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-medium text-lg text-zinc-900">Manajemen Aliran Stok Barang</h3>
                  <p className="text-zinc-500 text-xs font-light">Pantau mutasi masuk keluar barang, sisa persediaan, serta titik lokasi gudang penyimpanan secara transparan</p>
                </div>
              </div>

              {/* FILTERS TOOLBAR */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 p-4 rounded-2xl border border-zinc-150">
                <div>
                  <label className="block text-[10px] font-accent font-bold uppercase text-zinc-505 mb-1 text-zinc-600">Cari Produk / Gudang</label>
                  <input
                    type="text"
                    value={stockSearchQuery}
                    onChange={(e) => setStockSearchQuery(e.target.value)}
                    placeholder="Masukkan nama produk atau lokasi..."
                    className="w-full text-xs px-3.5 py-2 border border-zinc-200 rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-accent font-bold uppercase mb-1 text-zinc-600">Filter Golongan Kategori</label>
                  <select
                    value={stockCategoryFilter}
                    onChange={(e) => setStockCategoryFilter(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 border border-zinc-200 rounded-xl bg-white"
                  >
                    <option value="all">Semua Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-accent font-bold uppercase mb-1 text-zinc-600">Status Jumlah Sisa</label>
                  <select
                    value={stockStatusFilter}
                    onChange={(e) => setStockStatusFilter(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 border border-zinc-200 rounded-xl bg-white"
                  >
                    <option value="all">Semua Status</option>
                    <option value="tersedia">Stok Cukup (Sisa &gt; 5)</option>
                    <option value="hampir_habis">Hampir Habis (Sisa 1-5)</option>
                    <option value="habis">Stok Kosong (Habis)</option>
                  </select>
                </div>
              </div>

              {/* STOOK LEDGER TABLE */}
              <div className="overflow-x-auto border border-zinc-150 rounded-2xl bg-white shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-stone-50 border-b border-zinc-150 font-bold text-zinc-700 uppercase tracking-wider text-[10px] select-none">
                    <tr>
                      <th className="p-4">Info Produk</th>
                      <th className="p-4 text-center">Stok Awal</th>
                      <th className="p-4 text-center text-emerald-700">Barang Masuk</th>
                      <th className="p-4 text-center text-orange-700">Barang Keluar</th>
                      <th className="p-4 text-center text-maroon-700">Barang Terjual</th>
                      <th className="p-4 text-center font-bold">Sisa Stok</th>
                      <th className="p-4">Lokasi Penyimpanan</th>
                      <th className="p-4">Tanggal Update</th>
                      <th className="p-4 text-center">Aksi Kerja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-sans">
                    {stockLedger
                      .filter(item => {
                        const matchSearch = item.productName.toLowerCase().includes(stockSearchQuery.toLowerCase()) || 
                                            item.location.toLowerCase().includes(stockSearchQuery.toLowerCase());
                        const matchCat = stockCategoryFilter === 'all' || 
                                         (products.find(p => p.id === item.productId)?.categoryId === stockCategoryFilter);
                        
                        let matchStat = true;
                        if (stockStatusFilter === 'tersedia') {
                          matchStat = item.currentStock > 5;
                        } else if (stockStatusFilter === 'hampir_habis') {
                          matchStat = item.currentStock > 0 && item.currentStock <= 5;
                        } else if (stockStatusFilter === 'habis') {
                          matchStat = item.currentStock === 0;
                        }
                        return matchSearch && matchCat && matchStat;
                      })
                      .map((item, idx) => {
                        const productObj = products.find(p => p.id === item.productId);
                        return (
                          <tr key={idx} className="hover:bg-zinc-50/40 transition-colors">
                            <td className="p-4 font-medium text-zinc-900">
                              <div className="flex items-center gap-2.5">
                                {productObj?.imageUrl && (
                                  <img src={productObj.imageUrl} className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                                )}
                                <div>
                                  <p className="font-bold text-zinc-805 text-zinc-800 line-clamp-1">{item.productName}</p>
                                  <span className="text-[10px] font-accent text-zinc-400 capitalize">{productObj?.categoryName || 'Seni Kriya'}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-center font-semibold font-mono text-zinc-500">{item.initialStock}</td>
                            <td className="p-4 text-center font-semibold font-mono text-emerald-600 bg-emerald-50/15">+{item.stockIn}</td>
                            <td className="p-4 text-center font-semibold font-mono text-orange-600 bg-orange-50/15">-{item.stockOut}</td>
                            <td className="p-4 text-center font-semibold font-mono text-maroon-700 bg-rose-50/15">{item.soldCount}</td>
                            <td className="p-4 text-center font-bold">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                item.currentStock === 0 
                                  ? 'bg-rose-50 text-rose-800 border border-rose-100' 
                                  : item.currentStock <= 5 
                                    ? 'bg-amber-50 text-amber-800 border border-amber-100' 
                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                              }`}>
                                {item.currentStock} unit
                              </span>
                            </td>
                            <td className="p-4 text-zinc-600 font-medium">
                              <span className="px-2 py-1 bg-stone-100 rounded-lg text-[10.5px] border border-stone-200/50">{item.location}</span>
                            </td>
                            <td className="p-4 text-zinc-400 font-mono text-[10px]">{item.lastUpdated}</td>
                            <td className="p-4 text-center">
                              <button
                                type="button"
                                onClick={() => openEditStock(item)}
                                className="px-2.5 py-1 text-[11px] font-bold font-accent rounded-lg bg-zinc-100 hover:bg-maroon-800 text-zinc-700 hover:text-white transition-colors cursor-pointer border border-zinc-200 hover:border-maroon-900 inline-flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                Mutasi Stok
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* VIEW E: USER MANAGEMENT (ADMIN ONLY) */}
          {activeView === 'users' && role === 'ADMIN' && (
            <div className="space-y-6 animate-fade-in" id="view-users-management">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-medium text-base text-zinc-900">Manajemen Akun Pengguna</h3>
                  <p className="text-zinc-400 text-xs font-light">Kelola kredensial login, atur tingkat kewenangan peran (Admin, Editor, UMKM), dan kontrol status aktif setiap akun.</p>
                </div>
                
                <button
                  type="button"
                  onClick={openAddUser}
                  className="px-4 py-2 bg-maroon-700 hover:bg-maroon-800 text-white text-xs sm:text-sm font-accent font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                  id="btn-add-user"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Akun Baru
                </button>
              </div>

              <div className="overflow-x-auto border border-zinc-150 rounded-2xl bg-white shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-stone-50 border-b border-zinc-150 font-bold text-zinc-700 uppercase tracking-wider text-[10px] select-none">
                    <tr>
                      <th className="p-4">Nama Lengkap</th>
                      <th className="p-4">Email / Username</th>
                      <th className="p-4">Tingkat Hak Akses</th>
                      <th className="p-4">Kombinasi Sandi</th>
                      <th className="p-4">Tautan UMKM</th>
                      <th className="p-4">Status Akun</th>
                      <th className="p-4 text-center">Aksi Kendali</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150 text-zinc-700">
                    {systemUsers.map((usr) => {
                      const showPass = showUserPassword[usr.id] || false;
                      const boundUMKM = artisans.find(a => a.id === usr.umkmId);

                      return (
                        <tr key={usr.id} className="hover:bg-zinc-50/50">
                          <td className="p-4 font-semibold text-zinc-900">{usr.name}</td>
                          <td className="p-4 font-mono font-medium">{usr.email}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 border ${
                              usr.role === 'ADMIN' ? 'bg-red-50 text-red-800 border-red-200' :
                              usr.role === 'EDITOR' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}>
                              <Shield className="w-3 h-3" />
                              {usr.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 font-mono">
                              <span>{showPass ? usr.password : '••••••••'}</span>
                              <button
                                type="button"
                                onClick={() => setShowUserPassword({ ...showUserPassword, [usr.id]: !showPass })}
                                className="text-zinc-400 hover:text-zinc-600 focus:outline-none"
                              >
                                {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-zinc-500">
                            {usr.role === 'UMKM' ? (
                              boundUMKM ? `${boundUMKM.name} (${boundUMKM.owner})` : <span className="text-red-500 italic">Belum Ditautkan</span>
                            ) : (
                              <span className="text-zinc-300">-</span>
                            )}
                          </td>
                          <td className="p-4 font-accent">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                              usr.status === 'Aktif' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${usr.status === 'Aktif' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              {usr.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditUser(usr)}
                                className="p-1 px-2 rounded bg-zinc-100 hover:bg-maroon-100 hover:text-maroon-700 cursor-pointer"
                                title="Edit Kredensial"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            <button
                              type="button"
                              onClick={() => deleteUser(usr.id)}
                              className={`p-1 px-2 rounded transition-colors cursor-pointer ${
                                role === 'ADMIN'
                                  ? 'bg-zinc-100 hover:bg-rose-100 hover:text-rose-700 text-zinc-600'
                                  : 'bg-zinc-100/50 text-zinc-300 hover:bg-rose-50 hover:text-rose-500 border border-transparent'
                              }`}
                              title={role === 'ADMIN' ? 'Hapus' : 'Hanya Admin yang dapat menghapus pengguna'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* VIEW F: APPLICATION SETTINGS (ADMIN ONLY) */}
          {activeView === 'settings' && role === 'ADMIN' && (
            <form onSubmit={handleSaveSettings} className="space-y-8 animate-fade-in" id="view-platform-settings">
              <div>
                <h3 className="font-display font-medium text-base text-zinc-900">Pengaturan Sistem & Penyesuaian Tampilan</h3>
                <p className="text-zinc-400 text-xs font-light">
                  Kelaya konfigurasi branding instansi, slogan beranda utama, slideshow multimedia, koordinat peta pelayanan, serta daftar relasi kategori produk secara langsung.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column Settings Group */}
                <div className="space-y-6 bg-stone-50/50 p-6 rounded-2xl border border-zinc-100 border-zinc-200">
                  <h4 className="font-accent font-bold text-[10px] uppercase text-zinc-400 tracking-wider flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-maroon-600" />
                    1. Identitas Branding & Judul Utama
                  </h4>

                  <div className="space-y-4 text-xs font-sans">
                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Singkatan Logo (Header/Footer)</label>
                      <input
                        type="text"
                        required
                        value={settingsForm.logoText}
                        onChange={e => setSettingsForm({ ...settingsForm, logoText: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                        placeholder="misal: DM"
                      />
                    </div>

                    <div>
                      <ImageUploadInput
                        id="logo-image-upload"
                        label="Logo Resmi Organisasi (Gambar)"
                        value={settingsForm.logoUrl || ''}
                        onChange={val => setSettingsForm({ ...settingsForm, logoUrl: val })}
                        placeholder="Unggah gambar logo lingkaran or masukkan URL..."
                      />
                      <p className="text-[10.5px] text-zinc-500 mt-1 leading-normal">Unggah berkas gambar logo resmi Anda. Jika dikosongkan, sistem akan otomatis menggunakan inisial singkatan nama logo di atas.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 font-sans">
                      <div>
                        <label className="block font-bold text-zinc-700 uppercase mb-1">Nama Utama Brand</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.brandName}
                          onChange={e => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-bold text-maroon-850"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-700 uppercase mb-1">Sub Identitas Daerah</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.brandSub}
                          onChange={e => setSettingsForm({ ...settingsForm, brandSub: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-light text-zinc-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Judul Utama Banner Hero (H1)</label>
                      <input
                        type="text"
                        required
                        value={settingsForm.bannerTitle}
                        onChange={e => setSettingsForm({ ...settingsForm, bannerTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Slogan / Subtitle Banner</label>
                      <textarea
                        rows={2}
                        required
                        value={settingsForm.bannerSub}
                        onChange={e => setSettingsForm({ ...settingsForm, bannerSub: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Ucapan Hangat Footer & Disclaimer</label>
                      <textarea
                        rows={3}
                        required
                        value={settingsForm.footerGreeting}
                        onChange={e => setSettingsForm({ ...settingsForm, footerGreeting: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column Settings Group */}
                <div className="space-y-6 bg-stone-50/50 p-6 rounded-2xl border border-zinc-100 border-zinc-200">
                  <h4 className="font-accent font-bold text-[10px] uppercase text-zinc-400 tracking-wider flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-maroon-600" />
                    2. Integrasi Sosial Media & Kontak Hubung
                  </h4>

                  <div className="space-y-4 text-xs font-sans">
                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Saluran Utama WhatsApp (Penghubung Customer)</label>
                      <input
                        type="text"
                        required
                        value={settingsForm.whatsappNumber}
                        onChange={e => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-mono text-emerald-800 font-bold"
                        placeholder="Contoh: +6281234567890"
                      />
                      <p className="text-[10px] text-zinc-405 text-zinc-400 font-light mt-1">*Pastikan menyertakan kode negara (misal +62..)</p>
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Tautan Profil Instagram</label>
                      <input
                        type="url"
                        required
                        value={settingsForm.instagramUrl}
                        onChange={e => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-zinc-700 uppercase mb-1">Tautan Fanspage FB</label>
                        <input
                          type="url"
                          required
                          value={settingsForm.facebookUrl}
                          onChange={e => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-700 uppercase mb-1">Tautan Saluran YouTube</label>
                        <input
                          type="url"
                          required
                          value={settingsForm.youtubeUrl}
                          onChange={e => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Koordinat Lokasi Google Maps (Link Alamat)</label>
                      <input
                        type="text"
                        required
                        value={settingsForm.googleMapsUrl}
                        onChange={e => setSettingsForm({ ...settingsForm, googleMapsUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Tautan Embed Iframe Google Maps (Peta Visual)</label>
                      <input
                        type="text"
                        value={settingsForm.mapsEmbedIframeUrl || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, mapsEmbedIframeUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-mono text-[10px]"
                        placeholder="Masukkan tautan HTTPS Google Maps embed..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sejarah, Visi, Misi & Struktur Organisasi */}
              <div className="bg-stone-50/50 p-6 rounded-2xl border border-zinc-100 border-zinc-200 space-y-4 font-sans">
                <h4 className="font-accent font-bold text-[10px] uppercase text-zinc-400 tracking-wider flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-maroon-600" />
                  3. Sejarah, Visi, Misi & Struktur Organisasi
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
                  {/* Left sub-col: Sejarah and vision */}
                  <div className="space-y-4">
                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Judul Sambutan / Latar Belakang</label>
                      <input
                        type="text"
                        value={settingsForm.historyTitle || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, historyTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                        placeholder="misal: Menjaga Nyala Tradisi, Merajut Sejahtera Mandiri"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Konten Sejarah Singkat & Peran</label>
                      <textarea
                        rows={6}
                        value={settingsForm.historyContent || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, historyContent: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl leading-relaxed animate-none"
                        placeholder="Tuliskan latar belakang sejarah berdirinya Dekranasda..."
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Visi Utama Organisasi</label>
                      <textarea
                        rows={3}
                        value={settingsForm.vision || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, vision: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl leading-relaxed font-semibold italic text-zinc-750"
                        placeholder="Visi utama..."
                      />
                    </div>
                  </div>

                  {/* Right sub-col: Mission, Tasks and Chairperson info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Misi Utama (Satu baris per poin)</label>
                      <textarea
                        rows={5}
                        value={settingsForm.mission || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, mission: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl leading-relaxed font-mono text-[11px]"
                        placeholder="Membina regenerasi pengrajin muda...&#10;Melestarikan warisan weft alami...&#10;Memperluas pasar UMKM lokal..."
                      />
                      <p className="text-[10px] text-zinc-500 mt-0.5 leading-normal">*Pindahkan baris baru untuk memisahkan setiap butir misi.</p>
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Tugas & Fungsi Struktural</label>
                      <textarea
                        rows={3}
                        value={settingsForm.tasksContent || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, tasksContent: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl leading-relaxed"
                        placeholder="Menyelenggarakan pembinaan teknis..."
                      />
                    </div>

                    <div className="border-t border-zinc-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-4">
                        <div>
                          <label className="block font-bold text-zinc-700 uppercase mb-1">Nama Ketua Umum</label>
                          <input
                            type="text"
                            value={settingsForm.chairpersonName || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, chairpersonName: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                            placeholder="misal: Ibu Meldyanti Hagur"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-zinc-700 uppercase mb-1">Jabatan Ketua</label>
                          <input
                            type="text"
                            value={settingsForm.chairpersonRole || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, chairpersonRole: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                            placeholder="misal: Ketua Dekranasda Kabupaten Manggarai"
                          />
                        </div>
                      </div>
                      <div>
                        <ImageUploadInput
                          id="chairperson-photo-upload"
                          label="Foto Portret Ketua"
                          value={settingsForm.chairpersonPhoto || ''}
                          onChange={val => setSettingsForm({ ...settingsForm, chairpersonPhoto: val })}
                          placeholder="Pilih foto ketua..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filosofi Tenun Songke Manggarai Section */}
              <div className="bg-stone-50/50 p-6 rounded-2xl border border-zinc-100 border-zinc-200 space-y-4 font-sans">
                <h4 className="font-accent font-bold text-[10px] uppercase text-zinc-400 tracking-wider flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-maroon-600" />
                  4. Filosofi Tenun Songke Manggarai (Halaman Beranda Utama)
                </h4>
                
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Judul / Slogan Filosofi</label>
                    <input
                      type="text"
                      value={settingsForm.philosophyTitle || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, philosophyTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                      placeholder="misal: Sarung Tenun Adat Bermakna Filosofi Kosmologis"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Konten / Narasi Penjelasan Filosofi</label>
                    <textarea
                      rows={6}
                      value={settingsForm.philosophyContent || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, philosophyContent: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl leading-relaxed"
                      placeholder="Tuliskan filosofi, makna, atau latar sosiologis dibalik Tenun Songke Manggarai..."
                    />
                  </div>

                  <div className="pt-2">
                    <ImageUploadInput
                      id="philosophy-photo-upload"
                      label="Upload Foto / Gambar Representasi Filosofi"
                      value={settingsForm.philosophyPhoto || ''}
                      onChange={val => setSettingsForm({ ...settingsForm, philosophyPhoto: val })}
                      placeholder="Pilih atau unggah foto tenun songke..."
                    />
                  </div>
                </div>
              </div>

              {/* Hero Slideshow Image Direct Uploads Panel */}
              <div className="bg-stone-50/50 p-6 rounded-2xl border border-zinc-100 border-zinc-200 space-y-4 font-sans">
                <div>
                  <h4 className="font-accent font-bold text-[10px] uppercase text-zinc-400 tracking-wider flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-maroon-600" />
                    5. Gambar Slideshow Latar Belakang Beranda Utama (Bisa Upload Langsung / JPG / PNG)
                  </h4>
                  <p className="text-[10.5px] text-maroon-750 mt-1.5 font-medium leading-relaxed bg-maroon-50/50 border border-maroon-100 p-2.5 rounded-xl">
                    ⚠️ <strong>PENTING:</strong> Setelah mengunggah atau mengganti gambar slideshow di atas, Anda <strong>WAJIB</strong> menekan tombol <strong className="underline">"Simpan Semua Perubahan Pengaturan"</strong> di paling bawah halaman ini agar tersimpan di sistem browser Anda dan tidak hilang saat halaman dimuat ulang (refresh)!
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <ImageUploadInput
                      id="slide-upload-0"
                      label="Slide Latar 1 (Utama)"
                      value={settingsForm.bannerImages[0] || ''}
                      onChange={val => {
                        const newImgs = [...settingsForm.bannerImages];
                        newImgs[0] = val;
                        setSettingsForm({ ...settingsForm, bannerImages: newImgs });
                      }}
                      placeholder="Unggah gambar slide pertama..."
                    />
                  </div>
                  <div>
                    <ImageUploadInput
                      id="slide-upload-1"
                      label="Slide Latar 2 (Kebudayaan Flores)"
                      value={settingsForm.bannerImages[1] || ''}
                      onChange={val => {
                        const newImgs = [...settingsForm.bannerImages];
                        newImgs[1] = val;
                        setSettingsForm({ ...settingsForm, bannerImages: newImgs });
                      }}
                      placeholder="Unggah gambar slide kedua..."
                    />
                  </div>
                  <div>
                    <ImageUploadInput
                      id="slide-upload-2"
                      label="Slide Latar 3 (Kopi / Komoditas)"
                      value={settingsForm.bannerImages[2] || ''}
                      onChange={val => {
                        const newImgs = [...settingsForm.bannerImages];
                        newImgs[2] = val;
                        setSettingsForm({ ...settingsForm, bannerImages: newImgs });
                      }}
                      placeholder="Unggah gambar slide ketiga..."
                    />
                  </div>
                </div>
              </div>

              {/* Categories Manager Segment */}
              <div className="bg-stone-50/50 p-6 rounded-2xl border border-zinc-150 border-zinc-200 space-y-4" id="section-categories-editor">
                <div className="flex items-center justify-between">
                  <h4 className="font-accent font-bold text-[10px] uppercase text-zinc-400 tracking-wider flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-maroon-600" />
                    6. Manajemen Klasifikasi Kategori Produk ({categories.length})
                  </h4>
                  
                  <button
                    type="button"
                    onClick={openAddCategory}
                    className="px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-850 text-[10px] font-accent font-bold rounded-lg inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    Tambah Kategori
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  {categories.map(cat => (
                    <div key={cat.id} className="p-4 bg-white border border-zinc-150 rounded-xl flex items-start gap-3 relative shadow-xs hover:border-maroon-200 transition">
                      <div className="p-2.5 bg-maroon-50 rounded-xl text-maroon-800">
                        <Palette className="w-4 h-4" />
                      </div>
                      <div className="flex-grow min-w-0 pr-12">
                        <p className="font-bold text-zinc-900">{cat.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5 font-semibold">Kode ID: {cat.id}</p>
                        <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 leading-relaxed font-light">{cat.description}</p>
                      </div>
                      <div className="absolute right-3 top-3 flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditCategory(cat)}
                          className="p-1 px-2 rounded bg-zinc-100 hover:bg-maroon-50 hover:text-maroon-700 cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCategory(cat.id)}
                          className={`p-1 px-2 rounded transition-colors cursor-pointer ${
                            role === 'ADMIN'
                              ? 'bg-zinc-100 hover:bg-rose-50 hover:text-rose-700 text-zinc-650'
                              : 'bg-zinc-100/50 text-zinc-300 hover:bg-rose-50 hover:text-rose-500 border border-transparent'
                          }`}
                          title={role === 'ADMIN' ? 'Hapus' : 'Hanya Admin yang dapat menghapus kategori'}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Settings submit trigger */}
              <div className="flex justify-end pt-4 border-t border-zinc-200">
                <button
                  type="submit"
                  className="px-6 py-3 bg-maroon-700 hover:bg-maroon-800 text-white font-accent font-semibold rounded-xl text-xs sm:text-sm shadow-md cursor-pointer inline-flex items-center gap-1.5"
                  id="btn-save-settings"
                >
                  <CheckCircle className="w-4 h-4" />
                  Simpan Semua Perubahan Pengaturan
                </button>
              </div>
            </form>
          )}


          {/* VIEW: TESTIMONIAL MODERATION (ADMIN & EDITOR) */}
          {activeView === 'testimonials' && (role === 'ADMIN' || role === 'EDITOR') && (
            <div className="space-y-6 animate-fade-in" id="view-testimonials-moderation">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-medium text-base text-zinc-900">Moderasi & Kurasi Testimoni</h3>
                  <p className="text-zinc-400 text-xs font-light">
                    Saring, sunting, setujui, atau tolak testimoni dari pengunjung sebelum ditayangkan di halaman utama.
                  </p>
                </div>
                
                {/* Status Filter Buttons */}
                <div className="inline-flex rounded-xl bg-zinc-100 p-1 text-xs font-accent font-semibold flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => setTestiFilterStatus('ALL')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      testiFilterStatus === 'ALL' ? 'bg-white text-zinc-800 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    Semua ({testimonials.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestiFilterStatus('PENDING')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                      testiFilterStatus === 'PENDING' ? 'bg-white text-amber-700 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Tertunda ({testimonials.filter(t => t.status === 'PENDING').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestiFilterStatus('APPROVED')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                      testiFilterStatus === 'APPROVED' ? 'bg-white text-emerald-700 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Disetujui ({testimonials.filter(t => t.status === 'APPROVED').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestiFilterStatus('REJECTED')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                      testiFilterStatus === 'REJECTED' ? 'bg-white text-rose-700 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    Ditolak ({testimonials.filter(t => t.status === 'REJECTED').length})
                  </button>
                </div>
              </div>

              {/* Testimonials List */}
              {testimonials.filter(t => testiFilterStatus === 'ALL' || t.status === testiFilterStatus).length === 0 ? (
                <div className="bg-stone-50 border border-zinc-100 rounded-3xl p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-zinc-350 mx-auto mb-3" />
                  <p className="text-zinc-700 font-medium text-sm">Tidak ada testimoni dalam kriteria ini</p>
                  <p className="text-zinc-405 font-light text-xs mt-1">Data testimoni kosong atau tidak ada yang sesuai dengan kriteria filter Anda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 font-sans text-xs">
                  {testimonials
                    .filter(t => testiFilterStatus === 'ALL' || t.status === testiFilterStatus)
                    .map((testi) => (
                      <div
                        key={testi.id}
                        className="p-5 bg-white border border-zinc-150 rounded-2xl flex flex-col md:flex-row gap-5 items-start justify-between hover:border-maroon-150 shadow-xs transition animate-fade-in"
                      >
                        <div className="flex gap-4 items-start flex-grow min-w-0">
                          {testi.avatarUrl ? (
                            <img
                              src={testi.avatarUrl}
                              className="w-11 h-11 rounded-full object-cover border border-stone-100 flex-shrink-0"
                              alt={testi.name}
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-zinc-100 text-zinc-650 font-bold text-sm flex items-center justify-center flex-shrink-0">
                              {testi.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}

                          <div className="space-y-1.5 min-w-0 flex-grow">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                              <h4 className="font-bold text-zinc-900 text-sm">{testi.name}</h4>
                              <span className="text-[10px] text-zinc-400 font-light">• {testi.role || 'Pelanggan'}</span>
                              <span className="text-[9px] text-zinc-450 font-mono">({new Date(testi.createdAt).toLocaleDateString('id-ID')})</span>
                            </div>

                            <div className="flex items-center gap-1 text-gold-400">
                              {[...Array(5)].map((_, idx) => (
                                <Star
                                  key={idx}
                                  className={`w-3.5 h-3.5 ${
                                    idx < testi.rating ? 'fill-gold-400 text-gold-400' : 'text-zinc-200'
                                  }`}
                                />
                              ))}
                            </div>

                            <p className="text-zinc-650 font-light leading-relaxed pr-4 text-[12px]">
                              "{testi.text}"
                            </p>

                            {/* Show photos in admin moderation list */}
                            {testi.images && testi.images.length > 0 && (
                              <div className="flex gap-2 flex-wrap pt-2">
                                {testi.images.map((imgSrc, imgIdx) => (
                                  <a
                                    key={imgIdx}
                                    href={imgSrc}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-14 h-14 rounded-xl overflow-hidden border border-zinc-200 bg-stone-50 hover:border-maroon-300 hover:scale-105 active:scale-95 transition-all inline-block shadow-2xs"
                                    title="Klik untuk membuka gambar penuh di jendela baru"
                                  >
                                    <img
                                      src={imgSrc}
                                      className="w-full h-full object-cover"
                                      alt="Detail Lampiran"
                                      referrerPolicy="no-referrer"
                                    />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status badge & action buttons */}
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100">
                          <div className="flex items-center gap-1.5">
                            {testi.status === 'PENDING' && (
                              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold">
                                Saringan Moderasi
                              </span>
                            )}
                            {testi.status === 'APPROVED' && (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Ditayangkan
                              </span>
                            )}
                            {testi.status === 'REJECTED' && (
                              <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold">
                                Ditolak
                              </span>
                            )}
                          </div>

                          <div className="flex gap-2 items-center text-[10px] font-bold">
                            {testi.status !== 'APPROVED' ? (
                              <button
                                type="button"
                                onClick={() => handleApproveTestimonial(testi.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-accent"
                                title="Setujui komentar dan tayangkan di beranda"
                              >
                                {testi.status === 'PENDING' ? 'Seleksi & Tayangkan' : 'Tayangkan'}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleRejectTestimonial(testi.id)}
                                className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg transition-colors cursor-pointer font-accent"
                                title="Sembunyikan dari beranda"
                              >
                                Tahan / Sembunyikan
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setEditingTestimonial(testi)}
                              className="p-1.5 border border-zinc-200 hover:bg-zinc-100 rounded-lg cursor-pointer transition text-zinc-650"
                              title="Sunting Teks / Penilai / Penilaian"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteTarget({
                                  type: 'testimonial',
                                  id: testi.id,
                                  message: 'Hapus Testimoni Pengunjung',
                                  submessage: `Apakah Anda yakin ingin menghapus testimoni dari "${testi.name}" secara permanen? Tindakan ini tidak dapat dibatalkan.`
                                })
                              }
                              className="p-1.5 border border-zinc-200 hover:bg-rose-50 hover:text-rose-700 rounded-lg cursor-pointer transition text-zinc-450"
                              title="Hapus Permanen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}


          {/* C. EDIT TESTIMONIAL MODAL (ADMIN & EDITOR) */}
          {editingTestimonial && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-55 flex items-center justify-center p-4 shadow-2xl" id="modal-edit-testimonial">
              <form onSubmit={handleSaveEditTestimonial} className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col relative animate-fade-in">
                <div className="p-6 border-b border-zinc-150 bg-songke-light">
                  <h3 className="font-display font-medium text-lg text-zinc-900">
                    Sunting & Seleksi Testimoni
                  </h3>
                  <p className="text-zinc-500 text-xs font-light">Saring kata-kata kasar atau ubah kredensial sebelum dipublikasikan.</p>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Nama Lengkap Penilai</label>
                    <input
                      type="text"
                      required
                      value={editingTestimonial.name}
                      onChange={e => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-sm"
                      placeholder="Nama lengkap..."
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Peran / Profesi Penilai</label>
                    <input
                      type="text"
                      value={editingTestimonial.role || ''}
                      onChange={e => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-sm"
                      placeholder="Contoh: Kolektor Seni / Wisatawan"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Rating Penilaian (Bintang)</label>
                    <div className="flex gap-1.5 items-center mt-1">
                      {[1, 2, 3, 4, 5].map((starNum) => (
                        <button
                          key={starNum}
                          type="button"
                          onClick={() => setEditingTestimonial({ ...editingTestimonial, rating: starNum })}
                          className="p-1 cursor-pointer hover:scale-115 transition"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              starNum <= editingTestimonial.rating
                                ? 'fill-gold-400 text-gold-400'
                                : 'text-zinc-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Status Moderasi</label>
                    <select
                      value={editingTestimonial.status}
                      onChange={e => setEditingTestimonial({ ...editingTestimonial, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs"
                    >
                      <option value="PENDING">Tertunda / Moderasi</option>
                      <option value="APPROVED">Disetujui (Ditampilkan di Beranda)</option>
                      <option value="REJECTED">Ditolak</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Teks Ulasan Kunjungan</label>
                    <textarea
                      required
                      rows={5}
                      value={editingTestimonial.text}
                      onChange={e => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs leading-relaxed"
                      placeholder="Masukan teks apresiasi..."
                    />
                  </div>

                  {/* Foto lampiran ulasan */}
                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Foto Lampiran ({editingTestimonial.images ? editingTestimonial.images.length : 0}/3)</label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {editingTestimonial.images && editingTestimonial.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50 group">
                          <img src={img} className="w-full h-full object-cover" alt="Lampiran" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingTestimonial.images?.filter((_, i) => i !== idx) || [];
                              setEditingTestimonial({ ...editingTestimonial, images: updated });
                            }}
                            className="absolute top-1 right-1 p-1 bg-red-650 hover:bg-red-700 text-white rounded-full transition shadow cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {(!editingTestimonial.images || editingTestimonial.images.length < 3) && (
                        <label className="aspect-square border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-maroon-400 hover:bg-maroon-50/10 text-zinc-400">
                          <ImageIcon className="w-5 h-5 text-zinc-450" />
                          <span className="text-[10px] font-semibold text-center block">Upload Foto</span>
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (!files) return;
                              const fileList = Array.from(files) as File[];
                              const limit = 3 - (editingTestimonial.images ? editingTestimonial.images.length : 0);
                              const toProcess = fileList.slice(0, limit);

                              toProcess.forEach((file) => {
                                if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                                  alert(`Format "${file.name}" tidak didukung.`);
                                  return;
                                }
                                if (file.size > 2 * 1024 * 1024) {
                                  alert(`Berkas "${file.name}" melebihi batas 2MB.`);
                                  return;
                                }

                                const reader = new FileReader();
                                reader.onload = (evt) => {
                                  if (evt.target && typeof evt.target.result === 'string') {
                                    setEditingTestimonial(prev => {
                                      if (!prev) return null;
                                      return {
                                        ...prev,
                                        images: [...(prev.images || []), evt.target.result as string]
                                      };
                                    });
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

                <div className="p-6 bg-stone-50 border-t border-zinc-150 flex justify-end gap-3 text-xs font-accent">
                  <button
                    type="button"
                    onClick={() => setEditingTestimonial(null)}
                    className="px-4 py-2 border border-zinc-200 hover:bg-zinc-100 text-zinc-700 rounded-xl font-bold cursor-pointer transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-maroon-700 hover:bg-maroon-800 text-white rounded-xl font-bold cursor-pointer transition flex items-center gap-1.5 shadow-md"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          )}


          {/* B. SYSTEM USER ACCOUNT MODAL */}
          {showUserModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-55 flex items-center justify-center p-4 shadow-2xl" id="modal-system-user">
              <form onSubmit={saveUserObj} className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col relative animate-fade-in">
                <div className="p-6 border-b border-zinc-150 bg-songke-light">
                  <h3 className="font-display font-medium text-lg text-zinc-900">
                    {editingUser ? 'Edit Detail Akun Pengguna' : 'Tambah Kredensial Registrasi User Baru'}
                  </h3>
                  <p className="text-zinc-500 text-xs font-light">Atur otorisasi akses portal katalog Dekranasda</p>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Nama Lengkap Pengguna</label>
                    <input
                      type="text"
                      required
                      value={userForm.name}
                      onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                      placeholder="Contoh: Maria Yosefina"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Alamat Email / Kredensial Login</label>
                    <input
                      type="email"
                      required
                      value={userForm.email}
                      onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-mono text-[11px]"
                      placeholder="Contoh: maria@dekranasda.id"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Kata Sandi / Password Keamanan</label>
                    <input
                      type="text"
                      required
                      value={userForm.password}
                      onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-mono"
                      placeholder="Panjang sandi disarankan minimal 6 huruf..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Tingkat Hak Akses</label>
                      <select
                        value={userForm.role}
                        onChange={e => setUserForm({ ...userForm, role: e.target.value as any })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                      >
                        <option value="UMKM">UMKM Binaan</option>
                        <option value="EDITOR">Editor Publikasi</option>
                        <option value="ADMIN">Administrator Utama</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Status Keaktifan</label>
                      <select
                        value={userForm.status}
                        onChange={e => setUserForm({ ...userForm, status: e.target.value as any })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Nonaktif">Nonaktif / Suspend</option>
                      </select>
                    </div>
                  </div>

                  {userForm.role === 'UMKM' && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-normal">
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Hubungkan Sesi ke Pengrajin Binaan</label>
                      <select
                        value={userForm.umkmId}
                        onChange={e => setUserForm({ ...userForm, umkmId: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white border border-amber-200 rounded-lg"
                      >
                        {artisans.map(art => (
                          <option key={art.id} value={art.id}>{art.name} ({art.owner})</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-amber-700/80 font-light mt-1.5 italic">
                        *Sesi UMKM hanya diizinkan untuk mengelola katalog produk milik pengrajin yang ditautkan di atas.
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-zinc-150 bg-stone-50 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-850 rounded-xl cursor-pointer"
                  >
                    Batalkan
                    </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-maroon-700 hover:bg-maroon-800 text-white rounded-xl cursor-pointer font-bold"
                  >
                    Simpan Pengguna
                  </button>
                </div>
              </form>
            </div>
          )}


          {/* C. PRODUCT CATEGORY REGISTER MODAL */}
          {showCategoryModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-55 flex items-center justify-center p-4" id="modal-product-category">
              <form onSubmit={saveCategoryObj} className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col relative animate-fade-in">
                <div className="p-6 border-b border-zinc-150 bg-songke-light">
                  <h3 className="font-display font-medium text-lg text-zinc-900">
                    {editingCategory ? 'Edit Kategori Produk' : 'Buat Klasifikasi Kategori Produk Baru'}
                  </h3>
                  <p className="text-zinc-500 text-xs font-light">Atur kategori pajang untuk filter pencarian pembeli</p>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Kode Identifikasi ID (Unik / Tanpa Spasi)</label>
                    <input
                      type="text"
                      required
                      disabled={!!editingCategory}
                      value={categoryForm.id}
                      onChange={e => setCategoryForm({ ...categoryForm, id: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-mono disabled:bg-zinc-100 disabled:text-zinc-400"
                      placeholder="misal: bambu-modern"
                    />
                    <p className="text-[10px] text-zinc-405 text-zinc-400 font-light mt-1">*Contoh: anyaman, kuliner, tenun-halus</p>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Nama Kategori Koleksi</label>
                    <input
                      type="text"
                      required
                      value={categoryForm.name}
                      onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                      placeholder="Contoh: Kerajinan Bambu & Ukiran"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Gaya Ikon Representatif</label>
                    <select
                      value={categoryForm.icon}
                      onChange={e => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                    >
                      <option value="Layers">Layers (Tumpukan)</option>
                      <option value="Trees">Trees (Bambu / Pohon)</option>
                      <option value="Hammer">Hammer (Kayu / Alat)</option>
                      <option value="Grid3X3">Grid3X3 (Anyaman Rajut)</option>
                      <option value="Coffee">Coffee (Kopi & Kuliner)</option>
                      <option value="Gem">Gem (Permata / Aksesoris)</option>
                      <option value="Shirt">Shirt (Fashion & Busana)</option>
                      <option value="Sparkles">Sparkles (Kreatif / Inovasi)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Uraian Ringkas Deskripsi Pajang</label>
                    <textarea
                      rows={3}
                      required
                      value={categoryForm.description}
                      onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl leading-relaxed"
                      placeholder="Jelaskan jenis-jenis produk yang dikelompokkan dalam kategori ini..."
                    />
                  </div>
                </div>

                <div className="p-4 border-t border-zinc-150 bg-stone-50 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
                    className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-850 rounded-xl cursor-pointer"
                  >
                    Batalkan
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-maroon-700 hover:bg-maroon-800 text-white rounded-xl cursor-pointer font-bold"
                  >
                    Simpan Kategori
                  </button>
                </div>
              </form>
            </div>
          )}


          {/* ==============================================
              CRUD EDIT MODALS (DYNAMIC CONSOLE DRAWERS)
             ============================================== */}

          {/* 1. PRODUCT CRUD MODAL DRAWERS */}
          {showProductModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-55 flex items-center justify-center p-4">
              <form onSubmit={saveProduct} className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col relative animate-fade-in">
                <div className="p-6 border-b border-zinc-150 bg-songke-light">
                  <h3 className="font-display font-medium text-lg text-zinc-900">
                    {editingProduct ? 'Sunting Entri Produk' : 'Tambah Produk Anyar ke Katalog'}
                  </h3>
                  <p className="text-zinc-500 text-xs font-light">Lengkapi data agar tervisualisasi optimal di galeri pembeli</p>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Nama Produk</label>
                    <input
                      type="text"
                      required
                      value={prodForm.name}
                      onChange={e => setProdForm({ ...prodForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                      placeholder="Contoh: Kain Songke Manggarai Su'i Elegan"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Kategori Produk</label>
                      <select
                        value={prodForm.categoryId}
                        onChange={e => setProdForm({ ...prodForm, categoryId: e.target.value as CategoryId })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Pilih Pengrajin</label>
                      <select
                        disabled={role === 'UMKM'}
                        value={prodForm.umkmId}
                        onChange={e => setProdForm({ ...prodForm, umkmId: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl disabled:bg-zinc-100 disabled:text-zinc-400"
                      >
                        {artisans.map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.owner})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Harga (Rupiah)</label>
                      <input
                        type="number"
                        required
                        value={prodForm.price}
                        onChange={e => setProdForm({ ...prodForm, price: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                        placeholder="Harga dalam bentuk angka"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Status Ketersediaan</label>
                      <select
                        value={prodForm.stockStatus}
                        onChange={e => setProdForm({ ...prodForm, stockStatus: e.target.value as any })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                      >
                        <option value="Tersedia">Tersedia</option>
                        <option value="Pre-Order">Pre-Order</option>
                        <option value="Habis">Habis</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Tampilkan di Beranda?</label>
                      <select
                        value={prodForm.showOnHomepage ? "tampil" : "jangan"}
                        onChange={e => setProdForm({ ...prodForm, showOnHomepage: e.target.value === "tampil" })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-sm border-zinc-200 rounded-xl"
                      >
                        <option value="tampil">Tampil di Beranda</option>
                        <option value="jangan">Jangan Tampil di Beranda</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Tampilkan Nominal Harga?</label>
                      <select
                        value={prodForm.isPricePublic ? "publik" : "sembunyi"}
                        onChange={e => setProdForm({ ...prodForm, isPricePublic: e.target.value === "publik" })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                      >
                        <option value="publik">Ya, Publikasikan Harga</option>
                        <option value="sembunyi">Tidak (Hubungi Seller)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Uraian Bahan Utama</label>
                      <input
                        type="text"
                        required
                        value={prodForm.materials}
                        onChange={e => setProdForm({ ...prodForm, materials: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                        placeholder="misal: Benang Wol Katun, Sutera Alam"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Spesifikasi Ukuran</label>
                      <input
                        type="text"
                        required
                        value={prodForm.size}
                        onChange={e => setProdForm({ ...prodForm, size: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                        placeholder="misal: 110 x 200 CM"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Nama Karakter Motif (Khusus Tenun)</label>
                    <input
                      type="text"
                      value={prodForm.motifName}
                      onChange={e => setProdForm({ ...prodForm, motifName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                      placeholder="Tulis makna filosofis, misal: Motif Jok (Sarat Rezeki)"
                    />
                  </div>

                  <div>
                    <ImageUploadInput
                      id="product-image-upload"
                      label="Foto Produk Utama"
                      value={prodForm.imageUrl}
                      onChange={val => setProdForm({ ...prodForm, imageUrl: val })}
                      placeholder="Unggah foto produk utama (JPG/PNG)..."
                    />
                  </div>

                  <div className="bg-zinc-50 p-4.5 rounded-2xl border border-zinc-150 space-y-3">
                    <label className="block font-bold text-zinc-700 uppercase">Foto Galeri Tambahan (Mendukung Slideshow Bergerak)</label>
                    <p className="text-[10px] text-zinc-500 leading-normal">Unggah foto-foto detail karya lainnya yang akan otomatis menyusun visual galeri slide interaktif di rincian produk.</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="space-y-1">
                          <ImageUploadInput
                            id={`product-gallery-upload-${index}`}
                            label={`Foto Tambahan ${index + 1}`}
                            value={prodForm.galleryUrls?.[index] || ''}
                            onChange={(val) => {
                              const newGallery = [...(prodForm.galleryUrls || [])];
                              if (val) {
                                newGallery[index] = val;
                              } else {
                                newGallery.splice(index, 1);
                              }
                              setProdForm({ ...prodForm, galleryUrls: newGallery.filter(Boolean) });
                            }}
                            placeholder="Unggah foto / masukkan URL..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Ulasan / Uraian Deskripsi Mendalam</label>
                    <textarea
                      required
                      rows={3}
                      value={prodForm.description}
                      onChange={e => setProdForm({ ...prodForm, description: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl leading-relaxed"
                      placeholder="Jelaskan secara mendalam proses, makna atau petunjuk pemakaian..."
                    />
                  </div>
                </div>

                <div className="p-4 border-t border-zinc-150 bg-stone-50 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-850 rounded-xl cursor-pointer"
                  >
                    Batalkan
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-maroon-700 hover:bg-maroon-800 text-white rounded-xl cursor-pointer font-bold"
                  >
                    Simpan Karya
                  </button>
                </div>
              </form>
            </div>
          )}


          {/* 2. ARTISAN CRUD MODAL DRAWERS */}
          {showArtisanModal && role === 'ADMIN' && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-55 flex items-center justify-center p-4">
              <form onSubmit={saveArtisan} className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col relative animate-fade-in">
                <div className="p-6 border-b border-zinc-150 bg-songke-light">
                  <h3 className="font-display font-medium text-lg text-zinc-900">
                    {editingArtisan ? 'Sunting Profil Kelompok Pengrajin' : 'Registrasi Profil Pengrajin Daerah Baru'}
                  </h3>
                  <p className="text-zinc-500 text-xs font-light">Tautkan kontak WhatsApp agar pembeli terhubung instan</p>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Nama Brand Usaha</label>
                      <input
                        type="text"
                        required
                        value={artForm.name}
                        onChange={e => setArtForm({ ...artForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                        placeholder="Contoh: Koperasi Mandiri Colol"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Nama Pemilik/Ketua</label>
                      <input
                        type="text"
                        required
                        value={artForm.owner}
                        onChange={e => setArtForm({ ...artForm, owner: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                        placeholder="Contoh: Bapak Mikael J."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Keahlian Utama</label>
                      <input
                        type="text"
                        required
                        value={artForm.category}
                        onChange={e => setArtForm({ ...artForm, category: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                        placeholder="misal: Kerajinan Bambu & Kayu"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Tahun Berdiri</label>
                      <input
                        type="text"
                        required
                        value={artForm.established}
                        onChange={e => setArtForm({ ...artForm, established: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                        placeholder="misal: 2018"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Kecamatan Manggarai</label>
                      <input
                        type="text"
                        required
                        value={artForm.subdistrict}
                        onChange={e => setArtForm({ ...artForm, subdistrict: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                        placeholder="misal: Langke Rembong"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Desa / Kelurahan</label>
                      <input
                        type="text"
                        required
                        value={artForm.village}
                        onChange={e => setArtForm({ ...artForm, village: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                        placeholder="misal: Kel. Pitak"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">HP WhatsApp Seller (Format Internasional)</label>
                      <input
                        type="text"
                        required
                        value={artForm.phone}
                        onChange={e => setArtForm({ ...artForm, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-mono"
                        placeholder="Contoh: 628123456789"
                      />
                    </div>

                    <div>
                      <ImageUploadInput
                        id="artisan-avatar-upload"
                        label="Foto Avatar Profil"
                        value={artForm.avatar}
                        onChange={val => setArtForm({ ...artForm, avatar: val })}
                        placeholder="Unggah foto avatar profil (JPG/PNG)..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Alamat Jalan Lengkap Usaha</label>
                    <input
                      type="text"
                      required
                      value={artForm.address}
                      onChange={e => setArtForm({ ...artForm, address: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                      placeholder="Jalan, RT/RW, pedusunan..."
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Kisah Sejarah Singkat & Kepiawaian</label>
                    <textarea
                      required
                      rows={3}
                      value={artForm.description}
                      onChange={e => setArtForm({ ...artForm, description: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl leading-relaxed"
                      placeholder="Uraikan filosofi, jumlah pengrajin yang diberdayakan atau riwayat kelompok..."
                    />
                  </div>
                </div>

                <div className="p-4 border-t border-zinc-150 bg-stone-50 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowArtisanModal(false)}
                    className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-850 rounded-xl cursor-pointer"
                  >
                    Batalkan
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-maroon-700 hover:bg-maroon-800 text-white rounded-xl cursor-pointer font-bold"
                  >
                    Simpan Profil
                  </button>
                </div>
              </form>
            </div>
          )}


          {/* 3. NEWS CRUD MODAL DRAWERS */}
          {showNewsModal && role === 'ADMIN' && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-55 flex items-center justify-center p-4">
              <form onSubmit={saveNews} className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col relative animate-fade-in">
                <div className="p-6 border-b border-zinc-150 bg-songke-light">
                  <h3 className="font-display font-medium text-base text-zinc-900">
                    {editingNews ? 'Edit Publikasi Kabar' : 'Tulis Kabar & Publikasi Kegiatan Baru'}
                  </h3>
                  <p className="text-zinc-500 text-xs font-light">Diseminasi berita pelatihan, foto dokumentasi festival</p>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Judul Kabar Utama</label>
                    <input
                      type="text"
                      required
                      value={newsForm.title}
                      onChange={e => setNewsForm({ ...newsForm, title: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                      placeholder="Judul artikel pengumuman/pameran..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Kategori Kegiatan</label>
                      <select
                        value={newsForm.category}
                        onChange={e => setNewsForm({ ...newsForm, category: e.target.value as any })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                      >
                        <option value="Kegiatan">Kegiatan</option>
                        <option value="Pelatihan">Pelatihan</option>
                        <option value="Pameran">Pameran</option>
                        <option value="Pengumuman">Pengumuman</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Penulis Rilis</label>
                      <input
                        type="text"
                        required
                        value={newsForm.author}
                        onChange={e => setNewsForm({ ...newsForm, author: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <ImageUploadInput
                      id="news-image-upload"
                      label="Foto Utama Kabar"
                      value={newsForm.imageUrl}
                      onChange={val => setNewsForm({ ...newsForm, imageUrl: val })}
                      placeholder="Unggah foto rilis kabar (JPG/PNG)..."
                    />
                  </div>

                  {/* Foto Dokumentasi Tambahan */}
                  <div className="space-y-2.5 border-t border-zinc-100 pt-3">
                    <div className="flex items-center justify-between font-accent">
                      <label className="block font-bold text-zinc-700 uppercase">Foto Dokumentasi Tambahan ({newsForm.images?.length || 0})</label>
                      <button
                        type="button"
                        onClick={() => {
                          const currentSub = newsForm.images || [];
                          setNewsForm({
                            ...newsForm,
                            images: [...currentSub, '']
                          });
                        }}
                        className="px-2 py-1 bg-maroon-50 hover:bg-maroon-100 text-maroon-800 text-[10px] font-bold rounded-lg transition cursor-pointer"
                      >
                        + Tambah Foto
                      </button>
                    </div>

                    {newsForm.images && newsForm.images.length > 0 && (
                      <div className="space-y-3 pl-2.5 border-l-2 border-maroon-200">
                        {newsForm.images.map((val, idx) => (
                          <div key={idx} className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 space-y-2 relative">
                            <div className="flex items-center justify-between font-accent">
                              <span className="font-semibold text-zinc-650 text-[10px]">Foto Tambahan #{idx+1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const filtered = newsForm.images.filter((_, subIdx) => subIdx !== idx);
                                  setNewsForm({
                                    ...newsForm,
                                    images: filtered
                                  });
                                }}
                                className="text-[10px] text-red-600 hover:underline cursor-pointer font-bold"
                              >
                                Hapus
                              </button>
                            </div>
                            <ImageUploadInput
                              id={`news-subimage-${idx}`}
                              value={val}
                              onChange={(newVal) => {
                                const updatedSub = [...newsForm.images];
                                updatedSub[idx] = newVal;
                                setNewsForm({
                                  ...newsForm,
                                  images: updatedSub
                                });
                              }}
                              placeholder="Masukkan URL foto atau unggah..."
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Kutipan Ringkasan (Excerpt)</label>
                    <input
                      type="text"
                      required
                      value={newsForm.excerpt}
                      onChange={e => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl"
                      placeholder="Uraian singkat 1-2 kalimat pemikat..."
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Isi Berita Lengkap</label>
                    <textarea
                      required
                      rows={5}
                      value={newsForm.content}
                      onChange={e => setNewsForm({ ...newsForm, content: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl leading-relaxed"
                      placeholder="Tulis narasi berita lengkap di sini..."
                    />
                  </div>
                </div>

                <div className="p-4 border-t border-zinc-150 bg-stone-50 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewsModal(false)}
                    className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-850 rounded-xl cursor-pointer"
                  >
                    Batalkan
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-maroon-700 hover:bg-maroon-800 text-white rounded-xl cursor-pointer font-bold"
                  >
                    Pasang Rilis Berita
                  </button>
                </div>
              </form>
            </div>
          )}


          {/* STOCK LEDGER MUTATION DIALOG MODAL */}
          {showStockModal && selectedStockItem && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
              <form 
                onSubmit={saveStockData} 
                className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-zinc-150 overflow-hidden text-xs"
              >
                <div className="p-5 border-b border-zinc-150 bg-stone-55 flex items-center justify-between bg-stone-50">
                  <div>
                    <h3 className="font-display font-bold text-sm text-zinc-900">Form Mutasi Aliran Barang</h3>
                    <p className="text-[10px] text-zinc-400 font-light mt-0.5">Kelola sirkulasi masuk-keluar persediaan secara berkala</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowStockModal(false)}
                    className="p-1 rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  {/* Readonly product name info */}
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-zinc-150">
                    <span className="text-[9px] font-accent font-bold uppercase text-zinc-400">Nama Kerajinan / Produk</span>
                    <p className="font-bold text-xs text-zinc-800 mt-0.5">{stockForm.productName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-bold text-zinc-700 uppercase mb-1">Stok Awal</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={stockForm.initialStock}
                        onChange={e => setStockForm({ ...stockForm, initialStock: Math.max(0, parseInt(e.target.value) || 0) })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-mono text-center font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-750 uppercase mb-1 text-emerald-800">Barang Masuk (+)</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={stockForm.stockIn}
                        onChange={e => setStockForm({ ...stockForm, stockIn: Math.max(0, parseInt(e.target.value) || 0) })}
                        className="w-full px-3 py-2 bg-emerald-50/10 border border-emerald-200 rounded-xl font-mono text-center font-bold text-emerald-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-bold text-zinc-750 uppercase mb-1 text-orange-850">Barang Keluar (-)</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={stockForm.stockOut}
                        onChange={e => setStockForm({ ...stockForm, stockOut: Math.max(0, parseInt(e.target.value) || 0) })}
                        className="w-full px-3 py-2 bg-orange-50/10 border border-orange-200 rounded-xl font-mono text-center font-bold text-orange-700"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-750 uppercase mb-1 text-maroon-800">Barang Terjual</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={stockForm.soldCount}
                        onChange={e => setStockForm({ ...stockForm, soldCount: Math.max(0, parseInt(e.target.value) || 0) })}
                        className="w-full px-3 py-2 bg-rose-50/10 border border-rose-200 rounded-xl font-mono text-center font-bold text-maroon-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">Gubernur / Lokasi Penyimpanan Gudang</label>
                    <input
                      type="text"
                      required
                      value={stockForm.location}
                      onChange={e => setStockForm({ ...stockForm, location: e.target.value })}
                      className="w-full px-3.5 py-2 border border-zinc-200 rounded-xl bg-white"
                      placeholder="Contoh: Sentra Dekranasda Ruteng"
                    />
                  </div>

                  {/* Calculations Review Plate */}
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-150/70 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-[11px] text-zinc-800">Estimasi Sisa Stok Akhir</p>
                      <span className="text-[9.5px] text-zinc-400 font-mono">Formula: {stockForm.initialStock} + {stockForm.stockIn} - {stockForm.stockOut} - {stockForm.soldCount}</span>
                    </div>

                    <div className="text-right">
                      <span className={`text-base font-extrabold font-mono px-3 py-1 rounded-xl ${
                        (stockForm.initialStock + stockForm.stockIn - stockForm.stockOut - stockForm.soldCount) <= 0
                          ? 'bg-red-100 text-red-800'
                          : (stockForm.initialStock + stockForm.stockIn - stockForm.stockOut - stockForm.soldCount) <= 5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {Math.max(0, stockForm.initialStock + stockForm.stockIn - stockForm.stockOut - stockForm.soldCount)} unit
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-zinc-150 bg-stone-50 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowStockModal(false)}
                    className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-850 rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-maroon-700 hover:bg-maroon-800 text-white rounded-xl cursor-pointer font-bold flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Simpan Perubahan Stok
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Custom Delete Confirmation Modal */}
          {deleteTarget && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-60 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative border border-zinc-100 flex flex-col gap-4 animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 text-red-650 rounded-full flex-shrink-0 animate-pulse">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-zinc-900 leading-snug">
                      {deleteTarget.message}
                    </h3>
                    <p className="text-zinc-500 text-sm font-light mt-2 leading-relaxed">
                      {deleteTarget.submessage}
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex justify-end gap-3 text-xs text-medium">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(null)}
                    className="px-4 py-2 bg-zinc-150 hover:bg-zinc-200 text-zinc-800 rounded-xl cursor-pointer font-semibold transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={executeDelete}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl cursor-pointer font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-red-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Ya, Hapus Permanen
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
