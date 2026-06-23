export interface UMKM {
  id: string;
  name: string;
  owner: string;
  category: string;
  address: string;
  village: string; // desa/kelurahan
  subdistrict: string; // kecamatan
  phone: string; // WhatsApp number
  description: string;
  avatar: string;
  imageUrl?: string;
  rating: number;
  established: string;
  featured?: boolean;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  umkmId: string;
  umkmName: string;
  description: string;
  materials: string;
  size: string;
  price: number;
  isPricePublic: boolean;
  stockStatus: 'Tersedia' | 'Pre-Order' | 'Habis';
  imageUrl: string;
  galleryUrls: string[];
  motifName?: string; // and detail motif characteristic
  rating: number;
  views: number;
  createdAt: string;
  showOnHomepage?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: 'Kegiatan' | 'Pelatihan' | 'Pameran' | 'Pengumuman';
  imageUrl: string;
  images?: string[]; 
  author: string;
  likes?: number;
  dislikes?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'UMKM' | 'EDITOR';
  umkmId?: string; // Tautan ke UMKM can be mapped
  status: 'Aktif' | 'Nonaktif';
}

export interface SystemSettings {
  brandName: string;
  brandSub: string;
  bannerTitle: string;
  bannerSub: string;
  bannerImages: string[];
  logoText: string;
  footerGreeting: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  googleMapsUrl: string;
  mapsEmbedIframeUrl?: string;
  logoUrl?: string;
  historyTitle?: string;
  historyContent?: string;
  vision?: string;
  mission?: string;
  tasksContent?: string;
  chairpersonName?: string;
  chairpersonRole?: string;
  chairpersonPhoto?: string;
  philosophyTitle?: string;
  philosophyContent?: string;
  philosophyPhoto?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  avatarUrl?: string;
  images?: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

