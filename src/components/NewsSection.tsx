import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types';
import { 
  Calendar, 
  User, 
  ArrowRight, 
  X, 
  Newspaper, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Link2, 
  ChevronLeft, 
  ChevronRight,
  Check
} from 'lucide-react';

interface NewsSectionProps {
  news: NewsItem[];
  onUpdateNews?: (updatedNews: NewsItem[]) => void;
}

export default function NewsSection({ news, onUpdateNews }: NewsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // States to keep track of user reactions in local storage
  const [localReactions, setLocalReactions] = useState<Record<string, 'like' | 'dislike'>>({});

  useEffect(() => {
    // Load existing reactions from localStorage
    const saved = localStorage.getItem('dekranasda_news_reactions');
    if (saved) {
      try {
        setLocalReactions(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const categories = ['Semua', 'Pelatihan', 'Pameran', 'Kegiatan', 'Pengumuman'];

  const filteredNews = news.filter((item) => {
    return activeCategory === 'Semua' || item.category === activeCategory;
  });

  // Handle Likes & Dislikes
  const handleReaction = (newsId: string, type: 'like' | 'dislike') => {
    if (!onUpdateNews) return;

    const currentReaction = localReactions[newsId];
    let newReaction: 'like' | 'dislike' | null = null;

    const updatedNews = news.map((item) => {
      if (item.id === newsId) {
        let likes = item.likes || 0;
        let dislikes = item.dislikes || 0;

        if (currentReaction === type) {
          // Undo reaction
          if (type === 'like') {
            likes = Math.max(0, likes - 1);
          } else {
            dislikes = Math.max(0, dislikes - 1);
          }
          newReaction = null;
        } else {
          // Add or switch reaction
          if (currentReaction) {
            // Switch from other reaction
            if (currentReaction === 'like') {
              likes = Math.max(0, likes - 1);
              dislikes += 1;
            } else {
              dislikes = Math.max(0, dislikes - 1);
              likes += 1;
            }
          } else {
            // Brand new reaction
            if (type === 'like') {
              likes += 1;
            } else {
              dislikes += 1;
            }
          }
          newReaction = type;
        }

        const updatedItem = { ...item, likes, dislikes };
        // If selectedNews is open, update selectedNews state as well
        if (selectedNews && selectedNews.id === newsId) {
          setSelectedNews(updatedItem);
        }
        return updatedItem;
      }
      return item;
    });

    // Save to prop & local state & localStorage
    onUpdateNews(updatedNews);

    const updatedReactions = { ...localReactions };
    if (newReaction) {
      updatedReactions[newsId] = newReaction;
    } else {
      delete updatedReactions[newsId];
    }
    setLocalReactions(updatedReactions);
    localStorage.setItem('dekranasda_news_reactions', JSON.stringify(updatedReactions));
  };

  // Handle Share link copy
  const handleCopyLink = (item: NewsItem, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const cleanUrl = window.location.origin + window.location.pathname + '#news-' + item.id;
    navigator.clipboard.writeText(cleanUrl).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Handle WhatsApp Share
  const handleShareWA = (item: NewsItem, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const cleanUrl = window.location.origin + window.location.pathname + '#news-' + item.id;
    const shareText = `Baca Berita Terbaru dari Dekranasda Manggarai:\n*"${item.title}"*\n\nSelengkapnya di tautan resmi: ${cleanUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  // Open news details reset image slider
  const handleOpenNews = (item: NewsItem) => {
    setSelectedNews(item);
    setActiveImgIndex(0);
  };

  return (
    <div className="space-y-8" id="news-activities-section">
      {/* Intro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-100 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-medium text-zinc-900 flex items-center gap-2">
            <span className="w-1.5 h-8 bg-maroon-600 rounded-full" />
            Berita & Kegiatan Dekranasda
          </h2>
          <p className="text-zinc-500 text-sm mt-1 max-w-xl font-light">
            Ikuti perkembangan program pembinaan UMKM, dokumentasi pameran daerah, pendaftaran pelatihan produksi, dan agenda resmi Dekranasda Kabupaten Manggarai.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-thin">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-accent font-semibold flex-shrink-0 transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-maroon-700 text-white shadow-md shadow-maroon-900/15'
                  : 'bg-zinc-100 text-zinc-650 hover:bg-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of articles */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-12 p-8 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
          <p className="text-zinc-500 text-sm">Tidak ditemukan berita dalam kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => {
            const hasMultipleImages = item.images && item.images.filter(Boolean).length > 0;
            const imagesCount = [item.imageUrl, ...(item.images || [])].filter(Boolean).length;
            const hasUserLiked = localReactions[item.id] === 'like';
            const hasUserDisliked = localReactions[item.id] === 'dislike';

            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full cursor-pointer"
                onClick={() => handleOpenNews(item)}
              >
                {/* Photo */}
                <div className="relative pt-[56.25%] overflow-hidden bg-zinc-100">
                  <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-accent font-bold uppercase tracking-wider bg-black/75 text-white backdrop-blur-md rounded-md">
                    {item.category}
                  </span>
                  
                  {imagesCount > 1 && (
                    <span className="absolute top-3 right-3 z-10 px-2 py-0.5 text-[9px] font-accent font-extrabold bg-maroon-850/90 text-white rounded-md tracking-wider">
                      +{imagesCount - 1} Foto
                    </span>
                  )}

                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-550"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Text Block */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Meta stats */}
                  <div className="flex items-center gap-3.5 text-zinc-400 text-[11px] mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-maroon-500" />
                      {new Date(item.date).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-maroon-500" />
                      {item.author}
                    </span>
                  </div>

                  <h3 className="font-display font-medium text-zinc-900 group-hover:text-maroon-700 text-base leading-snug line-clamp-2 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-zinc-500 text-xs sm:text-sm font-light leading-relaxed line-clamp-3 mb-4">
                    {item.excerpt}
                  </p>

                  <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-xs text-maroon-700 font-accent font-bold inline-flex items-center gap-1 group-hover:underline">
                      Baca Selengkapnya
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </span>

                    {/* Quick Reactions & Share */}
                    <div className="flex items-center gap-2"          onClick={(e) => e.stopPropagation()}>
                      <button 
                        type="button"
                        onClick={() => handleReaction(item.id, 'like')}
                        className={`p-1.5 rounded-lg flex items-center gap-1 transition-all text-xs border border-zinc-100 hover:bg-zinc-50 ${
                          hasUserLiked ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'text-zinc-500'
                        }`}
                        title="Sukai"
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasUserLiked ? 'fill-emerald-800' : ''}`} />
                        <span className="font-semibold text-[10px]">{item.likes || 0}</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => handleReaction(item.id, 'dislike')}
                        className={`p-1.5 rounded-lg flex items-center gap-1 transition-all text-xs border border-zinc-100 hover:bg-zinc-50 ${
                          hasUserDisliked ? 'bg-rose-50 border-rose-200 text-rose-800' : 'text-zinc-500'
                        }`}
                        title="Tidak Suka"
                      >
                        <ThumbsDown className={`w-3.5 h-3.5 ${hasUserDisliked ? 'fill-rose-800' : ''}`} />
                        <span className="font-semibold text-[10px]">{item.dislikes || 0}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleShareWA(item)}
                        className="p-1.5 hover:bg-green-50 rounded-lg text-emerald-600 transition"
                        title="Bagikan ke WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL ARTICLE OVERLAY DIALOGUE */}
      {selectedNews && (() => {
        // Build accurate images carousel list
        const carouselImages = [
          selectedNews.imageUrl,
          ...(selectedNews.images || [])
        ].filter(Boolean);

        const currentImage = carouselImages[activeImgIndex] || selectedNews.imageUrl;
        const hasMultiple = carouselImages.length > 1;
        const hasUserLiked = localReactions[selectedNews.id] === 'like';
        const hasUserDisliked = localReactions[selectedNews.id] === 'dislike';

        const prevSlide = () => {
          setActiveImgIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
        };

        const nextSlide = () => {
          setActiveImgIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
        };

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-55 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col relative animate-fade-in">
              {/* Float Close */}
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/75 hover:bg-black text-white hover:scale-105 transition-all cursor-pointer z-20 shadow-md"
                title="Tutup Artikel"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Scrollable container */}
              <div className="overflow-y-auto">
                
                {/* Media Section: Carousel slider */}
                <div className="relative pt-[46%] bg-neutral-900 group/slider">
                  <img
                    src={currentImage}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
                    alt={`Slide ${activeImgIndex + 1}`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  
                  {/* Slider Control Arrows */}
                  {hasMultiple && (
                    <>
                      <button
                        type="button"
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black text-white cursor-pointer z-10 hover:scale-105 transition shadow"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black text-white cursor-pointer z-10 hover:scale-105 transition shadow"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-1 text-[10px] font-accent font-bold uppercase tracking-wider bg-gold-400 text-black rounded-md">
                        {selectedNews.category}
                      </span>
                      {hasMultiple && (
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-mono font-medium">
                          Foto {activeImgIndex + 1} dari {carouselImages.length}
                        </span>
                      )}
                    </div>
                    <h1 className="text-lg sm:text-2xl font-display font-medium text-white leading-tight">
                      {selectedNews.title}
                    </h1>
                  </div>
                </div>

                {/* Multiple Images Thumbnails tray */}
                {hasMultiple && (
                  <div className="bg-stone-50 border-b border-zinc-100 p-3 flex gap-2 overflow-x-auto justify-center">
                    {carouselImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImgIndex(idx)}
                        className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                          activeImgIndex === idx ? 'border-maroon-700 ring-2 ring-maroon-100' : 'border-zinc-200 hover:border-zinc-400'
                        }`}
                      >
                        <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Text content details */}
                <div className="p-6 sm:p-8 md:p-10">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-150 pb-4 mb-6">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-maroon-600" />
                        {new Date(selectedNews.date).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4 text-maroon-600" />
                        Penulis: {selectedNews.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Newspaper className="w-4 h-4 text-maroon-600" />
                        Dekranasda Kab. Manggarai Official
                      </span>
                    </div>

                    {/* Top level share tools */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyLink(selectedNews)}
                        className="px-3 py-1.5 rounded-xl text-xs font-accent font-semibold inline-flex items-center gap-1.5 transition bg-zinc-100 hover:bg-zinc-200 text-zinc-700 cursor-pointer"
                      >
                        {copiedId === selectedNews.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Link2 className="w-3.5 h-3.5" />
                            <span>Salin Link</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleShareWA(selectedNews)}
                        className="px-3 py-1.5 rounded-xl text-xs font-accent font-semibold inline-flex items-center gap-1.5 transition bg-emerald-50 hover:bg-emerald-100 text-emerald-800 cursor-pointer border border-emerald-100"
                      >
                        <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-zinc-700 text-sm sm:text-base leading-relaxed font-light whitespace-pre-line space-y-4">
                    {selectedNews.content}
                  </div>

                  {/* BOTTOM ACTIONS BAR: Reactions 👍👎 and close */}
                  <div className="mt-10 pt-6 border-t border-zinc-150 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400 font-accent uppercase tracking-wider font-bold">Apakah berita ini membantu?</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleReaction(selectedNews.id, 'like')}
                          className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all text-xs border font-medium cursor-pointer ${
                            hasUserLiked 
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm' 
                              : 'border-zinc-200 text-zinc-650 hover:bg-zinc-50'
                          }`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${hasUserLiked ? 'fill-emerald-800' : ''}`} />
                          <span>Membantu ({selectedNews.likes || 0})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleReaction(selectedNews.id, 'dislike')}
                          className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all text-xs border font-medium cursor-pointer ${
                            hasUserDisliked 
                              ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-sm' 
                              : 'border-zinc-200 text-zinc-650 hover:bg-rose-55'
                          }`}
                        >
                          <ThumbsDown className={`w-4 h-4 ${hasUserDisliked ? 'fill-rose-800' : ''}`} />
                          <span>Kurang ({selectedNews.dislikes || 0})</span>
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedNews(null)}
                      className="px-5 py-2.5 bg-maroon-700 hover:bg-maroon-800 active:scale-95 text-white font-accent font-semibold rounded-xl text-xs sm:text-sm cursor-pointer shadow-md transition-all self-end sm:self-auto"
                    >
                      Tutup Bacaan
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
