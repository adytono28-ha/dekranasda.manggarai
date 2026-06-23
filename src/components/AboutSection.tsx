import { MapPin, Phone, Mail, Award, BookOpen, ShieldCheck, Heart } from 'lucide-react';
import { SystemSettings } from '../types';

interface AboutSectionProps {
  settings?: SystemSettings;
}

export default function AboutSection({ settings }: AboutSectionProps) {
  const missionList = settings?.mission
    ? settings.mission.split('\n').filter(Boolean)
    : [
        "Membina regenerasi pengrajin muda di seluruh kecamatan dan melatih inovasi desain busana etnik.",
        "Melestarikan warisan weft alami ramah lingkungan serta melindungi kekayaan intelektual motif songke.",
        "Memperluas pasar UMKM lokal melalui penyediaan katalog digital, kemudahan akses WhatsApp, serta kemitraan niaga."
      ];

  const hasCustomLogoUrl = settings?.logoUrl && settings.logoUrl.trim().length > 0;

  return (
    <div className="space-y-12 animate-fade-in" id="about-section">
      
      {/* Intro Editorial Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Chairwoman Greeting Message Block */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative rounded-3xl overflow-hidden border border-maroon-150 shadow-lg bg-zinc-50 pt-[125%]">
            <img
              src={settings?.chairpersonPhoto || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=500"}
              alt={settings?.chairpersonName || "Sambutan Ketua Dekranasda"}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/90 via-maroon-905/30 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 text-white text-xs sm:text-sm">
              <p className="font-accent font-bold text-gold-400 uppercase tracking-widest text-[10px]">{settings?.chairpersonRole || 'Ketua Dekranasda'}</p>
              <h4 className="font-display font-semibold text-lg">{settings?.chairpersonName || 'Ibu Meldyanti Hagur'}</h4>
              <p className="text-maroon-200 text-xs font-light mt-0.5">{settings?.brandSub || 'Kabupaten Manggarai, NTT'}</p>
            </div>
          </div>

          {/* Large dynamic Logo display as requested "Pakai Logo ini" */}
          <div className="bg-white p-4 rounded-3xl border border-zinc-150 flex flex-col items-center justify-center text-center space-y-2">
            <p className="font-accent font-bold text-[9px] uppercase tracking-wider text-zinc-400">Lambang Resmi Organisasi</p>
            <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-zinc-50 border border-zinc-200 shadow-inner relative">
              {hasCustomLogoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt="Official Logo" 
                  className="w-full h-full object-contain p-1" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-maroon-700 text-gold-400 font-accent font-extrabold flex items-center justify-center border-b-2 border-gold-400">
                  <span className="text-lg tracking-wider text-white">{settings?.logoText || 'DM'}</span>
                </div>
              )}
            </div>
            <div>
              <p className="font-display font-bold text-zinc-800 text-xs">{settings?.brandName || 'DEKRANASDA'}</p>
              <p className="font-mono text-[9px] text-zinc-500 font-semibold">{settings?.brandSub || 'KAB. MANGGARAI, NTT'}</p>
            </div>
          </div>
        </div>

        {/* Written Message */}
        <div className="lg:col-span-8 space-y-5">
          <span className="text-xs font-accent font-bold text-maroon-700 uppercase tracking-widest">Sambutan Hangat</span>
          <h2 className="text-2xl sm:text-3xl font-display font-medium text-zinc-900 leading-tight">
            {settings?.historyTitle || "Menjaga Nyala Tradisi, Merajut Sejahtera Mandiri"}
          </h2>
          
          <div className="text-zinc-650 text-sm font-light leading-relaxed space-y-4">
            <p>
              <em>Sumbas/Salam hangat dari Bumi Congkar Lasa, Ruteng, {settings?.brandSub || 'Kabupaten Manggarai, NTT'}!</em>
            </p>
            <p>
              Kain tenun Songke Manggarai bukan sekadar jalinan benang penutup raga, melainkan sebait bait doa luhur yang dirajut oleh keteguhan jari jemari para ibu di pedusunan kami. Di dalam motifnya terdapat kearifan kosmologis leluhur kita, menjaga hubungan harmonis antara tuhan (Mori Karaeng), manusia, dan alam liar semesta.
            </p>
            <p>
              {settings?.brandName || 'Dekranasda'} {settings?.brandSub || 'Kabupaten Manggarai'} hadir sebagai jembatan pelestarian warisan budaya adiluhung ini. Website katalog ini dikembangkan untuk mendampingi transisi digital kelompok-kelompok pengrajin binaan kami di seluruh kecamatan — memperluas sayap promosi mereka ke kancah nasional maupun dunia.
            </p>
            <p className="font-medium text-maroon-900">
              Mari bersama-sama kita lestarikan keunikan budaya lokal serta mendukung kesejahteraan ekonomi kreatif Manggarai dengan membeli karya asli buatan tangan terampil daerah kita.
            </p>
          </div>
        </div>
      </div>

      {/* Main Stats card grid for history and organization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-150">
        
        {/* Left block: Sejarah singkat */}
        <div className="space-y-4">
          <h3 className="font-display font-medium text-xl text-zinc-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-maroon-600" />
            Sejarah Singkat & Peran
          </h3>
          <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed font-light">
            {settings?.historyContent || `${settings?.brandName || 'Dekranasda'} ${settings?.brandSub || 'Kabupaten Manggarai'} didirikan sebagai bagian dari jaringan Dewan Kerajinan Nasional Republik Indonesia yang berfokus pada pelestarian seni kriya daerah yang terancam punah. Sejak dekade 1980-an, organisasi kami terus membina penenun di berbagai pelosok adat (seperti kawasan Wae Rebo, Cibal, Lelak, dan Satar Mese) agar teknik tenun ikat tradisional, pewarnaan alamiah dari tumbuhan lokal, serta kriya anyaman daun pandan (Re'a) tetap hidup di generasi muda.`}
          </p>
        </div>

        {/* Right block: Visi & Misi */}
        <div className="space-y-4">
          <h3 className="font-display font-medium text-xl text-zinc-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-maroon-600" />
            Visi dan Misi Utama
          </h3>
          <div className="space-y-3.5 text-zinc-650 text-xs sm:text-sm font-light leading-relaxed">
            <p>
              <strong>Visi:</strong> {settings?.vision || `Menjadikan kerajinan kriya khas ${settings?.brandSub || 'Kabupaten Manggarai'} sebagai produk unggulan berdaya saing global yang berakar kuat pada kelestarian nilai adat kebudayaan daerah Flores.`}
            </p>
            <div className="space-y-1.5 pl-4 border-l border-red-300">
              {missionList.map((m, idx) => (
                <p key={idx}>• {m.replace(/^•\s*/, '')}</p>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Task and structure duties breakdown block */}
      <div className="bg-songke-light rounded-3xl p-6 sm:p-8 border border-maroon-100 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="space-y-1.5 max-w-xl">
          <h4 className="font-display font-medium text-zinc-90 text-sm sm:text-xl">
            Tugas & Fungsi Struktural {settings?.brandName || 'Dekranasda'}
          </h4>
          <p className="text-zinc-600 text-xs sm:text-sm font-light leading-relaxed">
            {settings?.tasksContent || `Menyelenggarakan pembinaan teknis secara kolaboratif bersama dinas pariwisata, dinas koperasi, serta dinas perdagangan ${settings?.brandSub || 'Kabupaten Manggarai'} demi menjamin permodalan, mutu standardisasi rasa/kriya, serta promosi pameran berkala.`}
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-auto text-xs">
          <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-zinc-200">
            <Award className="w-4 h-4 text-maroon-700" />
            <span>Fungsi: Sertifikasi & Hak Paten Kekayaan Intelektual Daerah</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-zinc-200">
            <Heart className="w-4 h-4 text-maroon-700" />
            <span>Advokasi: Kesejahteraan Penenun Wanita Pedusunan</span>
          </div>
        </div>
      </div>

      {/* Contact & Secretariat info block */}
      <div className="pt-8 border-t border-zinc-150 grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        <a 
          href={settings?.googleMapsUrl || 'https://maps.google.com/?q=Avenida+Komodo+No.+10,+Ruteng,+Flores,+NTT'} 
          target="_blank" 
          rel="noreferrer" 
          className="p-4 bg-zinc-50 hover:bg-zinc-100 transition rounded-2xl border flex gap-3.5 items-center cursor-pointer"
        >
          <div className="p-3 bg-white text-maroon-600 rounded-xl">
            <MapPin className="w-5 h-5 text-maroon-700" />
          </div>
          <div>
            <h4 className="font-accent font-bold text-zinc-800 text-xs uppercase tracking-wider">Kantor Sekretariat</h4>
            <p className="text-zinc-500 text-xs mt-0.5 select-all">Ruteng, Flores, NTT (Peta Lokasi)</p>
          </div>
        </a>

        <a 
          href={`https://wa.me/${settings?.whatsappNumber?.replace(/[^0-9]/g, '') || '6281234567890'}`}
          target="_blank" 
          rel="noreferrer" 
          className="p-4 bg-zinc-50 hover:bg-zinc-100 transition rounded-2xl border flex gap-3.5 items-center cursor-pointer"
        >
          <div className="p-3 bg-white text-maroon-600 rounded-xl">
            <Phone className="w-5 h-5 text-maroon-700" />
          </div>
          <div>
            <h4 className="font-accent font-bold text-zinc-800 text-xs uppercase tracking-wider">Layanan Hubungan</h4>
            <p className="text-zinc-500 text-xs mt-0.5">WhatsApp: {settings?.whatsappNumber || '+62 812-3456-7890'}</p>
          </div>
        </a>

        <div className="p-4 bg-zinc-50 rounded-2xl border flex gap-3.5 items-center">
          <div className="p-3 bg-white text-maroon-600 rounded-xl">
            <Mail className="w-5 h-5 text-maroon-700" />
          </div>
          <div>
            <h4 className="font-accent font-bold text-zinc-800 text-xs uppercase tracking-wider">Email Surat Resmi</h4>
            <p className="text-zinc-500 text-xs mt-0.5 select-all">sekretariat@dekranasda-manggarai.go.id</p>
          </div>
        </div>
      </div>

      {/* Responsive interactive Google Maps Embed Iframe */}
      {settings?.mapsEmbedIframeUrl && (
        <div className="pt-8 border-t border-zinc-150">
          <div className="text-left mb-6 max-w-xl">
            <h3 className="font-display font-medium text-xl text-zinc-900 flex items-center gap-2">
              <span className="w-1 h-5 bg-maroon-600 rounded-full" />
              Peta Sekretariat Dekranasda
            </h3>
            <p className="text-zinc-500 text-xs mt-1">Interaksi peta langsung di bawah untuk menavigasi arah rute ke kantor sekretariat kami.</p>
          </div>
          <div className="w-full h-80 rounded-3xl overflow-hidden shadow-lg border border-zinc-200">
            <iframe
              src={settings.mapsEmbedIframeUrl}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Kantor Dekranasda"
            ></iframe>
          </div>
        </div>
      )}

    </div>
  );
}
