"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface JournalUploaderProps {
  isDemo?: boolean; // ← TAMBAHIN INI
}

export default function JournalUploader({ isDemo = false }: JournalUploaderProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caption', caption);

      const response = await fetch(`/api/journal/upload?filename=${file.name}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      // Reset form
      setFile(null);
      setPreview(null);
      setCaption("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      router.refresh();
    } catch (err) {
      setError("Gagal mengunggah foto. Pastikan konfigurasi Vercel Blob sudah benar.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="form-card mb-xl">
      <div className="section-header">
        <h2 className="section-title">Tambah Jurnal Baru</h2>
      </div>
      
      {isDemo ? (
        // Tampilan Mode Demo - Kotak dengan gembok
        <div 
          className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-border-default rounded-lg bg-bg-input/50 pointer-events-none select-none"
          style={{ cursor: 'not-allowed' }}
        >
          <svg className="w-12 h-12 text-muted mb-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/>
          </svg>
          <p className="text-sm font-medium text-secondary">Mode Demo Aktif</p>
          <p className="text-xs text-muted mt-1">Anda hanya dapat melihat data.</p>
        </div>
      ) : (
        <form onSubmit={handleUpload} className="flex flex-col gap-md">
          {!preview ? (
            <div className="file-input">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                ref={fileInputRef}
                required
              />
              <div className="file-input-label py-12">
                <div className="flex-col items-center gap-sm">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>Pilih atau tarik foto ke sini</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-md">
              <div className="relative rounded-lg overflow-hidden border border-border-default bg-black flex justify-center max-h-64">
                <img src={preview} alt="Preview" className="max-h-64 object-contain" />
                <button 
                  type="button" 
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black text-white p-2 rounded-full"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              
              <textarea 
                placeholder="Ceritakan tentang momen ini..." 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="input"
                rows={3}
                required
              />
              
              {error && <p className="text-danger text-sm">{error}</p>}
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isUploading}
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="2" x2="12" y2="6"/>
                      <line x1="12" y1="18" x2="12" y2="22"/>
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                      <line x1="2" y1="12" x2="6" y2="12"/>
                      <line x1="18" y1="12" x2="22" y2="12"/>
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                    </svg>
                    Mengunggah...
                  </span>
                ) : "Simpan Jurnal"}
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}