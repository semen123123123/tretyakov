'use client';

import { useState, useRef } from 'react';

interface ImageUploaderProps {
  currentUrl?: string | null;
  onUpload: (url: string) => void;
}

export default function ImageUploader({ currentUrl, onUpload }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Только изображения (JPEG, PNG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Файл слишком большой. Максимум 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setPreview(data.url);
      onUpload(data.url);
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
            className="absolute top-1 right-1 bg-[var(--ink)] text-white text-xs w-5 h-5 flex items-center justify-center"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
          className="text-sm text-[var(--ash)] file:mr-3 file:py-1 file:px-3 file:border file:border-[var(--ink)] file:text-xs file:bg-[var(--white)] file:text-[var(--ink)]"
        />
        {uploading && <span className="text-xs text-[var(--ash)]">Загрузка...</span>}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
