'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface ImageUploaderProps {
  currentUrl?: string | null;
  onUpload: (url: string) => void;
}

export default function ImageUploader({ currentUrl, onUpload }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ensureBucket = async () => {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some(b => b.name === 'images');
    if (!exists) {
      await supabase.storage.createBucket('images', { public: true });
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Только изображения (JPEG, PNG, WEBP)');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Файл слишком большой. Максимум 5MB');
      return;
    }

    setUploading(true);

    try {
      await ensureBucket();

      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      setPreview(publicUrl);
      onUpload(publicUrl);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">
        Изображение
      </label>

      {preview && (
        <div className="relative w-32 h-32 border border-[var(--ash)] overflow-hidden mb-2">
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 bg-[var(--ink)]/70 text-white text-xs w-5 h-5 flex items-center justify-center hover:bg-[var(--ink)]"
          >
            &times;
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className={`inline-block px-4 py-2 text-xs font-mono uppercase tracking-wide cursor-pointer border border-[var(--ink)] hover:bg-[var(--raw-paper)] transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          {uploading ? 'Загрузка...' : 'Выбрать файл'}
        </label>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
