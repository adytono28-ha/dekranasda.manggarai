import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Link, AlertTriangle } from 'lucide-react';

interface ImageUploadInputProps {
  id: string;
  value: string;
  onChange: (newValue: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUploadInput({
  id,
  value,
  onChange,
  label,
  placeholder = 'Pilih berkas foto...'
}: ImageUploadInputProps) {
  const [useUrl, setUseUrl] = useState<boolean>(!value || value.startsWith('http'));
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.match('image.*')) {
      setErrorMsg('Berkas harus berupa gambar JPG/PNG!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        const rawBase64 = event.target.result;
        
        // Compress and downscale using HTML5 Canvas
        const img = new Image();
        img.onload = () => {
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          // Compute new dimensions keeping aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            // Fill background with white in case transparent PNG is drawn
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            
            // Output high performance JPEG base64 (75% quality)
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
            onChange(compressedBase64);
          } else {
            // Fallback if canvas context is unavailable
            onChange(rawBase64);
          }
        };
        img.onerror = () => {
          setErrorMsg('Format gambar tidak valid atau tidak bisa dibaca.');
        };
        img.src = rawBase64;
      }
    };
    reader.onerror = () => {
      setErrorMsg('Gagal membaca berkas gambar.');
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2 text-xs" id={`wrapper-${id}`}>
      <div className="flex items-center justify-between">
        {label && <label className="block font-bold text-zinc-700 uppercase tracking-wide">{label}</label>}
        
        {/* Toggle between Upload and URL */}
        <button
          type="button"
          onClick={() => {
            setUseUrl(!useUrl);
            setErrorMsg('');
          }}
          className="text-[10px] text-maroon-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          {useUrl ? (
            <>
              <Upload className="w-3 h-3" />
              Upload Langsung (JPG/PNG)
            </>
          ) : (
            <>
              <Link className="w-3 h-3" />
              Gunakan Alamat URL Web
            </>
          )}
        </button>
      </div>

      {useUrl ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={value}
            id={id}
            onChange={(e) => onChange(e.target.value)}
            className="flex-grow px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-mono"
            placeholder={placeholder || 'Masukkan alamat URL foto...'}
          />
          {value && (
            <div className="w-10 h-10 border rounded-lg overflow-hidden flex-shrink-0 bg-zinc-50 relative">
              <img src={value} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="preview" />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {/* File Upload Dropzone Representation */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed ${
              value ? 'border-emerald-300 bg-emerald-50/10' : 'border-zinc-300 hover:border-maroon-400 bg-zinc-50'
            } rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5`}
            id={`dropzone-${id}`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            {value ? (
              <div className="flex items-center gap-3 text-left w-full">
                <div className="w-12 h-12 border rounded-xl overflow-hidden bg-white flex-shrink-0 relative">
                  <img src={value} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="preview" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-emerald-800 text-xs">Foto Siap Disimpan!</p>
                  <p className="text-[10px] text-zinc-500 truncate">Format lokal terkompresi Base64</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                  className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg text-[10px] transition"
                >
                  Hapus
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-6 h-6 text-zinc-400" />
                <p className="font-medium text-zinc-600 block">Klik untuk memilih foto dari perangkat Anda</p>
                <p className="text-[10.5px] text-zinc-400 leading-normal">Mendukung resolusi tinggi format JPG, JPEG, PNG</p>
              </>
            )}
          </div>

          {errorMsg && (
            <div className="text-red-650 bg-red-50 p-2 rounded-xl flex items-center gap-1 border border-red-100 mt-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
