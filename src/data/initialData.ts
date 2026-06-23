import { Product, UMKM, NewsItem, Category, SystemUser, SystemSettings, Testimonial } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'tenun',
    name: 'Tenun Ikat & Songke',
    description: 'Kain tenun legendaris Manggarai dengan motif sarat makna filosofis seperti Jok, Su\'i, dan Wela Runu.',
    icon: 'Layers'
  },
  {
    id: 'bambu',
    name: 'Kerajinan Bambu',
    description: 'Dekorasi rumah, wadah serbaguna tradisional (Loko, Seka), dan perabotan bambu ramah lingkungan.',
    icon: 'Trees'
  },
  {
    id: 'kayu',
    name: 'Kerajinan Kayu',
    description: 'Ukiran khas Manggarai, miniatur rumah adat Mbaru Niang, dan peralatan dapur estetis dari kayu jati/sonokeling.',
    icon: 'Hammer'
  },
  {
    id: 'anyaman',
    name: 'Anyaman Tradisional',
    description: 'Kerajinan anyaman daun pandan hutan (Re\'a) dan serat rotan seperti topi adat, tikar (Teka), dan tas.',
    icon: 'Grid3X3'
  },
  {
    id: 'kuliner',
    name: 'Kuliner Khas & Kopi',
    description: 'Kopi Arabika/Robusta Lembah Colol peraih penghargaan nasional, rebok manis, dan camilan lokal Manggarai.',
    icon: 'Coffee'
  },
  {
    id: 'aksesoris',
    name: 'Aksesoris & Souvenir',
    description: 'Gelang manik-manik, kalung etnik khas Flores, gantungan kunci Mbaru Niang, dan selendang penyambutan.',
    icon: 'Gem'
  },
  {
    id: 'fashion',
    name: 'Fashion & Busana Etnik',
    description: 'Pakaian modern terpadu bahan tenun Songke Manggarai, jas formal kasual kantoran, dan blazer etnik.',
    icon: 'Shirt'
  },
  {
    id: 'kreatif',
    name: 'Produk Kreatif Lainnya',
    description: 'Inovasi produk ramah lingkungan pengganti plastik, hiasan lampu, dan kaligrafi bermotif Manggarai.',
    icon: 'Sparkles'
  }
];

export const INITIAL_UMKM: UMKM[] = [
  {
    id: 'umkm-1',
    name: 'Tenun Songke Wae Rebo',
    owner: 'Ibu Maria Din',
    category: 'Tenun Ikat & Songke',
    address: 'Jl. Ahmad Yani No. 24, Kel. Pitak',
    village: 'Pitak',
    subdistrict: 'Langke Rembong',
    phone: '6281234567890',
    description: 'Bengkel tenun tradisional yang memberdayakan lebih dari 15 penenun wanita di sekitar Desa Satar Lenda dan Ruteng. Kami fokus mempertahankan motif klasik asli Manggarai dengan pewarna alami.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
    imageUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    established: '2012',
    featured: true
  },
  {
    id: 'umkm-2',
    name: 'Kopi Kencana Lembah Colol',
    owner: 'Bapak Yoseph Danggur',
    category: 'Kuliner Khas & Kopi',
    address: 'Kawasan Wisata Kopi Colol, Desa Colol',
    village: 'Colol',
    subdistrict: 'Lembah Colol',
    phone: '6281333444555',
    description: 'Produsen kopi spesialis Arabika dan Robusta premium dari dataran tinggi Colol. Kopi kami dipanen secara pilih-merah dari pohon kopi warisan kolonial dan diproses secara higienis untuk menghasilkan cita rasa fruity dan spicy yang khas.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    established: '2015',
    featured: true
  },
  {
    id: 'umkm-3',
    name: 'Bambu Lestari Wae Ri\'i',
    owner: 'Bapak Fransiskus Jemadu',
    category: 'Kerajinan Bambu',
    address: 'Desa Golo Cador, Kec. Wae Ri\'i',
    village: 'Golo Cador',
    subdistrict: 'Wae Ri\'i',
    phone: '6287766554433',
    description: 'Pusat pelatihan dan produksi anyaman bambu berkualitas tinggi. Menghasilkan aneka keranjang hantaran estetis, tudung saji modern, dan kap lampu gantung yang digemari oleh kafe dan hotel di Labuan Bajo dan Bali.',
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=200&h=200',
    imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    established: '2018',
    featured: false
  },
  {
    id: 'umkm-4',
    name: 'Sanggar Seni & Ukir Mbaru Niang',
    owner: 'Bapak Sebastianus Satar',
    category: 'Kerajinan Kayu',
    address: 'Jl. Katedral No. 12, Kel. Watu',
    village: 'Watu',
    subdistrict: 'Langke Rembong',
    phone: '6281223344556',
    description: 'Mengkhususkan diri pada ukiran kayu adat dan pembuatan replika miniatur rumah adat Mbaru Niang Wae Rebo. Setiap produk dibuat dari kayu pilihan tahan rayap dengan presisi detail arsitektur luhur Manggarai.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    established: '2010',
    featured: true
  },
  {
    id: 'umkm-5',
    name: 'Anyaman Re\'a Rembong',
    owner: 'Ibu Anastasia Murni',
    category: 'Anyaman Tradisional',
    address: 'RT 05 / RW 02, Desa Liang Sola',
    village: 'Liang Sola',
    subdistrict: 'Lelak',
    phone: '6285338877665',
    description: 'Komunitas anyaman ibu-ibu rumah tangga yang mengolah daun pandan liar (Re\'a) menjadi produk fungsional modern seperti topi adat Manggarai, clucth bag wanita, serta tikar lantai halus bermotif warna-warni.',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200&h=200',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    established: '2020',
    featured: false
  },
  {
    id: 'umkm-6',
    name: 'Sinar Flores Fashion & Aksesoris',
    owner: 'Ibu Clara Lestari',
    category: 'Fashion & Busana Etnik',
    address: 'Jl. Diponegoro Kel. Pau, Ruteng',
    village: 'Pau',
    subdistrict: 'Langke Rembong',
    phone: '6282112233445',
    description: 'Butik kreatif yang mengkombinasikan keindahan tenun ikat lokal Flores dengan potongan tren busana modern modern. Kami membuat pakaian kasual, gaun pesta, rompi, dan aksesoris etnik seperti kalung kayu & anting tenun.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    established: '2017',
    featured: false
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Kain Songke Manggarai Motif Jok',
    categoryId: 'tenun',
    categoryName: 'Tenun Ikat & Songke',
    umkmId: 'umkm-1',
    umkmName: 'Tenun Songke Wae Rebo',
    description: 'Sarung tenun Songke premium dengan motif "Jok" (full motif padat). Motif Jok melambangkan kemakmuran, derajat yang luhur, dan kelimpahan rezeki. Dibuat secara manual menggunakan benang katun pilihan berhiaskan benang emas/perak metalik yang berkilau anggun.',
    materials: 'Benang Katun Mercerized, Benang Mas Cantik, Pewarna Alami',
    size: '115 cm x 175 cm (Ukuran standar dewasa)',
    price: 1350000,
    isPricePublic: true,
    stockStatus: 'Tersedia',
    imageUrl: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&q=80&w=800',
    galleryUrls: [
      'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=800'
    ],
    motifName: 'Motif Jok (Kemakmuran Luhur)',
    rating: 5.0,
    views: 425,
    createdAt: '2026-05-10T10:00:00.000Z'
  },
  {
    id: 'prod-2',
    name: 'Selendang Songke Manggarai Motif Su\'i',
    categoryId: 'tenun',
    categoryName: 'Tenun Ikat & Songke',
    umkmId: 'umkm-1',
    umkmName: 'Tenun Songke Wae Rebo',
    description: 'Selendang songke yang ditenun dengan garis-garis pembatas vertikal bermotif "Su\'i" di ujungnya. Sangat cocok digunakan untuk upacara adat, wisuda, ibadah ritual keagamaan, atau sebagai aksesoris kebaya dan jas formal panggung.',
    materials: 'Benang Katun, Benang Rayon Emas',
    size: '180 cm x 25 cm',
    price: 250000,
    isPricePublic: true,
    stockStatus: 'Tersedia',
    imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=800',
    galleryUrls: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&q=80&w=800'
    ],
    motifName: 'Motif Su\'i (Pembatas Batas Kehidupan)',
    rating: 4.8,
    views: 212,
    createdAt: '2026-06-01T08:30:00.000Z'
  },
  {
    id: 'prod-3',
    name: 'Kopi Arabika Colol Yellow Caturra Single Origin',
    categoryId: 'kuliner',
    categoryName: 'Kuliner Khas & Kopi',
    umkmId: 'umkm-2',
    umkmName: 'Kopi Kencana Lembah Colol',
    description: 'Varian kopi langka "Yellow Caturra" (pohon kopi berkulit buah kuning matang) asli dari perkebunan alami di ketinggian 1.400 mdpl Lembah Colol. Diolah dengan metode full-wash, menghasilkan keasaman jeruk lembut (citrusy note) dan aftertaste manis karamel yang bersih.',
    materials: '100% Biji Kopi Arabika Yellow Caturra',
    size: 'Kemasan Gusset Alumunium Foil 200 gram (Bubuk / Biji)',
    price: 85000,
    isPricePublic: true,
    stockStatus: 'Tersedia',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    galleryUrls: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=800'
    ],
    motifName: 'Yellow Caturra Colol Flores',
    rating: 4.9,
    views: 618,
    createdAt: '2026-05-18T14:20:00.000Z'
  },
  {
    id: 'prod-4',
    name: 'Kopi Robusta Colol Fine Traditional',
    categoryId: 'kuliner',
    categoryName: 'Kuliner Khas & Kopi',
    umkmId: 'umkm-2',
    umkmName: 'Kopi Kencana Lembah Colol',
    description: 'Kopi Robusta pusaka yang menghasilkan body tebal dengan notes cokelat hitam pekat, kacang sangrai, bebas bau tanah. Profil sangrai tingkat medium-dark, sangat nikmat disajikan dengan susu kental manis atau dinikmati hitam pekat murni sebagai kopi tubruk pagi hari.',
    materials: '100% Robusta Colol Pilihan',
    size: 'Kemasan Foil 250 gram',
    price: 45000,
    isPricePublic: true,
    stockStatus: 'Tersedia',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=800',
    galleryUrls: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=800'
    ],
    motifName: 'Organic Traditional Cultivation',
    rating: 4.7,
    views: 340,
    createdAt: '2026-06-03T11:15:00.000Z'
  },
  {
    id: 'prod-5',
    name: 'Keranjang Bambu Estetis Model Loko Hantaran',
    categoryId: 'bambu',
    categoryName: 'Kerajinan Bambu',
    umkmId: 'umkm-3',
    umkmName: 'Bambu Lestari Wae Ri\'i',
    description: 'Wadah silinder anyaman bambu ganda yang diadaptasi dari bentuk "Loko" tradisional Manggarai. Telah dihaluskan tanpa serabut kasar, diberi finishing anti jamur (food-grade). Sangat menawan digunakan sebagai wadah parcel ramah lingkungan, keranjang piknik, atau dekorasi meja makan modern.',
    materials: 'Bambu Tali Hitam / Bambu Hijau Pewarna Alami',
    size: 'Diameter 25 cm, Tinggi 30 cm (dengan pegangan)',
    price: 110000,
    isPricePublic: true,
    stockStatus: 'Tersedia',
    imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800',
    galleryUrls: [
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800'
    ],
    motifName: 'Anyaman Keranjang Loko Manggarai',
    rating: 4.9,
    views: 189,
    createdAt: '2026-05-27T09:00:00.000Z'
  },
  {
    id: 'prod-6',
    name: 'Miniatur Rumah Adat Mbaru Niang Wae Rebo',
    categoryId: 'kayu',
    categoryName: 'Kerajinan Kayu',
    umkmId: 'umkm-4',
    umkmName: 'Sanggar Seni & Ukir Mbaru Niang',
    description: 'Replika arsitektur ikonik Mbaru Niang (rumah adat kerucut Manggarai yang memperoleh Aga Khan Award). Dikerjakan secara manual dengan pilar kayu jati kokoh, atap berselimut anyaman ijuk, serta memiliki tingkat detail interior 5 lantai melambangkan filosofi kehidupan adat lokal.',
    materials: 'Kayu Jati, Serat Kelapa / Atap Ijuk, Bambu Kerangka',
    size: 'Alas diameter 35 cm, Tinggi total 40 cm',
    price: 850000,
    isPricePublic: true,
    stockStatus: 'Pre-Order',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
    galleryUrls: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?auto=format&fit=crop&q=80&w=800'
    ],
    motifName: 'Miniatur Filosofi Lima Tingkat Lodok',
    rating: 5.0,
    views: 490,
    createdAt: '2026-05-01T15:00:00.000Z'
  },
  {
    id: 'prod-7',
    name: 'Topi Adat Suku Manggarai (Topi Re\'a Kulit Pandan)',
    categoryId: 'anyaman',
    categoryName: 'Anyaman Tradisional',
    umkmId: 'umkm-5',
    umkmName: 'Anyaman Re\'a Rembong',
    description: 'Topi anyaman khas Manggarai yang biasa dipakai oleh kaum pria dalam menyambut tamu agung atau upacara tari Caci. Anyaman dibuat sangat rapat dari helai daun pandan duri (Re\'a) luhur, mengkilat secara alami tanpa zat kimia buatan.',
    materials: 'Daun Re\'a (Pandan Duri Hutan)',
    size: 'Diameter 28 cm, keliling kepala dapat disesuaikan',
    price: 150000,
    isPricePublic: true,
    stockStatus: 'Tersedia',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
    galleryUrls: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800'
    ],
    motifName: 'Anyaman Re\'a khas Lelak',
    rating: 4.6,
    views: 134,
    createdAt: '2026-06-10T11:45:00.000Z'
  },
  {
    id: 'prod-8',
    name: 'Blazer Etnik Pria Kombinasi Tenun Songke',
    categoryId: 'fashion',
    categoryName: 'Fashion & Busana Etnik',
    umkmId: 'umkm-6',
    umkmName: 'Sinar Flores Fashion & Aksesoris',
    description: 'Blazer semi-formal modern dengan aksentuasi potongan kain tenun songke Manggarai asli di bagian dada, saku samping, dan kerah dalam. Menampilkan karakter profesional berkelas yang bangga akan warisan budaya nusantara.',
    materials: 'Kain Katun Toyobo Premium & Tenun Songke Manggarai Asli',
    size: 'Tersedia ukuran S, M, L, XL, XXL',
    price: 495000,
    isPricePublic: true,
    stockStatus: 'Pre-Order',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
    galleryUrls: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800'
    ],
    motifName: 'Su\'i Accent Modern Cut',
    rating: 4.8,
    views: 298,
    createdAt: '2026-05-25T13:10:00.000Z'
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Pelatihan Pewarnaan Alami Benang Tenun Songke Manggarai angkatan 2026',
    excerpt: 'Dekranasda Manggarai menggelar pelatihan teknis intensif pemanfaatan dedaunan hutan setempat untuk meningkatkan nilai ekspor kain tenun.',
    content: 'Ruteng - Ketua Dekranasda Kabupaten Manggarai secara resmi membuka Pelatihan Pewarnaan Alami Benang Tenun Songke bagi 40 kelompok wanita penenun lokal yang diadakan di Aula Sekretariat Dekranasda Kabupaten Manggarai.\n\nDalam sambutannya, beliau menekankan bahwa pasar internasional sangat mengapresiasi bahan organik yang ramah lingkungan. Pelatihan ini melatih peserta mengekstrak kulit kayu soga, daun tarum (indigo), buah kemiri, dan akar mengkudu guna menghasilkan spektrum warna tradisional Manggarai yang mempesona tanpa merusak alam.\n\n"Kita harap dengan standarisasi pewarnaan alami ini, harga jual selembar kain songke bermutu tinggi bisa meningkat berlipat ganda di pasar ekspor," ujar Ketua Dekranasda.',
    date: '2026-06-15',
    category: 'Pelatihan',
    imageUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1532156828625-d720b0051fdf?auto=format&fit=crop&q=80&w=600'
    ],
    author: 'Humas Dekranasda',
    likes: 18,
    dislikes: 0
  },
  {
    id: 'news-2',
    title: 'Pameran Akbar Kerajinan Khas Manggarai di Festival Waterfront Labuan Bajo',
    excerpt: 'Dekranasda Manggarai memboyong ribuan produk unggulan UMKM binaan dalam menyambut puncak kunjungan turis mancanegara.',
    content: 'Labuan Bajo - Produk-produk kerajinan dari Kabupaten Manggarai sukses memikat mata para wisatawan asing dalam pameran yang diselenggarakan di koridor Waterfront Labuan Bajo.\n\nKategori produk terlaris di antaranya adalah Kopi Arabika Colol Yellow Caturra, Miniatur Mbaru Niang kayu jati, serta ragam selendang sutera tenunan tangan. Keikutsertaan ini membuktikan kesiapan lini produk Kabupaten Manggarai dalam menyokong Destinasi Pariwisata Super Prioritas Labuan Bajo.\n\nOmset kumulatif UMKM selama pameran tiga hari mencapai rekor luar biasa, yang diharapkan menjadi cambuk motivasi produksi bagi desa-desa kerajinan kita.',
    date: '2026-06-10',
    category: 'Pameran',
    imageUrl: 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600'
    ],
    author: 'Staf Promosi',
    likes: 24,
    dislikes: 1
  },
  {
    id: 'news-3',
    title: 'Bantuan Alat Produksi Spinner Madu & Mesin Roasting Kopi untuk UMKM Pedusunan',
    excerpt: 'Dekranasda bekerja sama dengan Dinas Koperasi menyalurkan bantuan fasilitas modern guna menjamin kebersihan dan efisiensi produk pangan daerah.',
    content: 'Ruteng - Sebagai langkah konkret aksi pemulihan ekonomi kreatif pasca tantangan iklim mikro, Dekranasda menyalurkan 12 unit mesin pembersih bambu mekanis serta 3 unit mesin roasting kopi termonitor digital.\n\nBantuan ini diberikan langsung secara merata kepada koperasi tani di Lembah Colol dan anyaman di Wae Ri\'i. Ketua Dekranasda menekankan pentingnya peralihan teknologi penunjang agar UMKM sanggup melayani kuantitas grosir secara berkala tetapi dengan kebersihan mutu produk yang tetap konsisten.',
    date: '2026-05-28',
    category: 'Kegiatan',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=800',
    author: 'Bidang Sarpras',
    likes: 12,
    dislikes: 0
  }
];

export const INITIAL_USERS: SystemUser[] = [
  {
    id: 'user-1',
    name: 'Administrator Utama',
    email: 'admin@dekranasda.id',
    password: 'admin123',
    role: 'ADMIN',
    status: 'Aktif'
  },
  {
    id: 'user-2',
    name: 'Ibu Maria Din',
    email: 'umkm@manggarai.net',
    password: 'umkm123',
    role: 'UMKM',
    umkmId: 'umkm-1',
    status: 'Aktif'
  },
  {
    id: 'user-3',
    name: 'Editor Publikasi Humas',
    email: 'editor@dekranasda.id',
    password: 'editor123',
    role: 'EDITOR',
    status: 'Aktif'
  }
];

export const INITIAL_SETTINGS: SystemSettings = {
  brandName: 'DEKRANASDA',
  brandSub: 'KAB. MANGGARAI, NTT',
  bannerTitle: 'Dekranasda Kabupaten Manggarai',
  bannerSub: 'Melestarikan Budaya, Meningkatkan Ekonomi Kreatif Daerah',
  bannerImages: [
    'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=1600&h=600',
    'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?auto=format&fit=crop&q=80&w=1600&h=600',
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=1600&h=600'
  ],
  logoText: 'DM',
  footerGreeting: 'Koleksi resmi katalog digital terverifikasi Dewan Kerajinan Adat Nasional Daerah, memfasilitasi kemitraan niaga kerajinan khas Flores, Nusa Tenggara Timur secara global.',
  whatsappNumber: '+6281234567890',
  instagramUrl: 'https://instagram.com/dekranasdamanggarai',
  facebookUrl: 'https://facebook.com/dekranasdamanggarai',
  youtubeUrl: 'https://youtube.com/@dekranasdamanggarai',
  googleMapsUrl: 'https://maps.google.com/?q=Avenida+Komodo+No.+10,+Ruteng,+Flores,+NTT',
  mapsEmbedIframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15783.336184518485!2d120.45!3d-8.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2db33568c07fac2f%3A0xb36d77bd83a00244!2sRuteng%2C%20Kabupaten%20Manggarai%2C%20Nusa%20Tenggara%20Timur!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
  logoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="48" fill="white" stroke="%233f3f46" stroke-width="1"/><circle cx="50" cy="50" r="42" fill="%23e11d48"/><path d="M50 18 L53 28 L63 28 L55 34 L58 44 L50 38 L42 44 L45 34 L37 28 L47 28 Z" fill="white"/><path d="M28 68 C24 58 35 44 41 52 C43 55 44 58 44 68 L44 82 L34 82 L28 68 Z" fill="white"/><path d="M72 68 C76 58 65 44 59 52 C57 55 56 58 56 68 L56 82 L66 82 L72 68 Z" fill="white"/><rect x="46" y="62" width="8" height="20" fill="white" rx="1"/></svg>',
  historyTitle: 'Menjaga Nyala Tradisi, Merajut Sejahtera Mandiri',
  historyContent: 'Dekranasda Kabupaten Manggarai didirikan sebagai bagian dari jaringan Dewan Kerajinan Nasional Republik Indonesia yang berfokus pada pelestarian seni kriya daerah yang terancam punah. Sejak dekade 1980-an, organisasi kami terus membina penenun di berbagai pelosok adat (seperti kawasan Wae Rebo, Cibal, Lelak, dan Satar Mese) agar teknik tenun ikat tradisional, pewarnaan alamiah dari tumbuhan lokal, serta kriya anyaman daun pandan tetap hidup di generasi muda.',
  vision: 'Menjadikan kerajinan kriya khas Kabupaten Manggarai sebagai produk unggulan berdaya saing global yang berakar kuat pada kelestarian nilai adat kebudayaan daerah Flores.',
  mission: 'Membina regenerasi pengrajin muda di seluruh kecamatan dan melatih inovasi desain busana etnik.\nMelestarikan warisan weft alami ramah lingkungan serta melindungi kekayaan intelektual motif songke.\nMemperluas pasar UMKM lokal melalui penyediaan katalog digital, kemudahan akses WhatsApp, serta kemitraan niaga.',
  tasksContent: 'Menyelenggarakan pembinaan teknis secara kolaboratif bersama dinas pariwisata, dinas koperasi, serta dinas perdagangan Kabupaten Manggarai demi menjamin permodalan, mutu standardisasi rasa/kriya, serta promosi pameran berkala.',
  chairpersonName: 'Ibu Meldyanti Hagur',
  chairpersonRole: 'Ketua Dekranasda Kabupaten Manggarai',
  chairpersonPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=500',
  philosophyTitle: 'Sarung Tenun Adat Bermakna Filosofi Kosmologis',
  philosophyContent: 'Bagi orang Flores Manggarai Barat, Manggarai, dan Manggarai Timur, kain tenun Songke wajib dikenakan saat ritual pemanggilan roh leluhur, perkawinan adat, dan tari tombak Caci. Setiap benang emas mewakili mata angin, tanda kesaksian mori karaeng, serta harapan melimpahnya hasil jagung meler di lingko sasi lodok.',
  philosophyPhoto: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600'
};

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'testi-1',
    name: 'Helena Maria',
    role: 'Kolektor Seni Tenun',
    text: 'Sangat mengagumi keindahan kain Songke Manggarai yang saya pesan melalui portal ini. Kualitas jahitan dan kerapihan motif Jok-nya sangat luar biasa luar biasa. Pelayanan pengrajin lewat WhatsApp juga sangat tanggap!',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
    status: 'APPROVED',
    createdAt: '2026-06-10T12:00:00Z'
  },
  {
    id: 'testi-2',
    name: 'Yustus Guntur',
    role: 'Desainer Interior',
    text: 'Kerajinan anyaman bambu dari rupa Wae Ri\'i menambah aksen etnik modern yang sangat hangat untuk proyek resort kami di Labuan Bajo. Sukses terus untuk UMKM binaan Dekranasda Kabupaten Manggarai!',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
    status: 'APPROVED',
    createdAt: '2026-06-12T14:30:00Z'
  },
  {
    id: 'testi-3',
    name: 'Theresia Abut',
    role: 'Wisatawan Domestik',
    text: 'Produk tas songke kecil yang dibeli sangat praktis dan fashionable. Banyak sekali teman-teman kantor yang bertanya di mana membelinya setelah saya kembali dari liburan di Flores.',
    rating: 4,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150',
    status: 'APPROVED',
    createdAt: '2026-06-15T09:15:00Z'
  },
  {
    id: 'testi-4',
    name: 'Andika Pratama',
    role: 'Pecinta Kopi Nusantara',
    text: 'Kopi Manggarai Colol yang diproduksi oleh UMKM binaan memiliki notes rasa rempah yang manis dan khas sekali. Proses pengiriman cepat sekali dan dikemas rapi.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
    status: 'PENDING',
    createdAt: '2026-06-18T16:45:00Z'
  }
];


