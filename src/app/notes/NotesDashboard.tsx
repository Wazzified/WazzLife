"use client";

import { useState, useEffect } from "react";
import { createNote, updateNote, deleteNote } from "../action/note";
import EmptyState from "../components/EmptyState";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesDashboardProps {
  initialNotes: any[];
  isDemo?: boolean;
}

export default function NotesDashboard({ initialNotes, isDemo = false }: NotesDashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openNewNoteModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const openEditNoteModal = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get("title") as string;
      const content = formData.get("content") as string;

      if (editingNote) {
        const updated = await updateNote(editingNote.id, { title, content });
        setNotes(prev => 
          prev.map(n => n.id === updated.id ? updated : n).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        );
      } else {
        const created = await createNote({ title, content });
        setNotes(prev => [created, ...prev]);
      }
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Hapus catatan ini?")) return;
    
    // Optimistic UI update
    setNotes(prev => prev.filter(n => n.id !== id));
    await deleteNote(id);
  };

  if (!mounted) return null;

  return (
    <>
      <div className="flex justify-between items-center mb-xl">
        <div className="page-header mb-0">
          <h1 className="page-title">Notes</h1>
          <p className="page-subtitle">Simpan catatan, ide, atau pengingat bebas Anda</p>
        </div>
        
        {/* Tombol Catatan Baru - Hidden kalau demo */}
        {!isDemo && (
          <button onClick={openNewNoteModal} className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Catatan Baru
          </button>
        )}
      </div>

      {isDemo ? (
        // Tampilan Mode Demo - Kotak dengan gembok
        <div 
          className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border-default rounded-lg bg-bg-input/50 pointer-events-none select-none"
          style={{ cursor: 'not-allowed' }}
        >
          <svg className="w-16 h-16 text-muted mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/>
          </svg>
          <h3 className="text-lg font-semibold text-secondary mb-2">Mode Demo Aktif</h3>
          <p className="text-sm text-muted max-w-md">
            Fitur Notes terkunci. Login sebagai Admin untuk membuat, mengedit, atau menghapus catatan.
          </p>
        </div>
      ) : notes.length === 0 ? (
        <EmptyState 
          title="Belum ada catatan" 
          description="Klik 'Catatan Baru' untuk mulai menulis ide atau hal penting yang perlu Anda ingat."
          icon={
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          }
        />
      ) : (
        <div className="grid-cols-3">
          {notes.map(note => (
            <div 
              key={note.id} 
              className="card card-interactive relative group flex flex-col h-[220px]"
              onClick={() => openEditNoteModal(note)}
            >
              <div className="flex justify-between items-start mb-sm">
                <h3 className="font-semibold text-lg line-clamp-1 flex-1 pr-8">{note.title}</h3>
                <button 
                  onClick={(e) => handleDelete(note.id, e)} 
                  className="absolute top-3 right-3 text-muted hover:text-danger hover:bg-danger/10 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-all z-10"
                  title="Hapus"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
              
              <p className="text-sm text-secondary whitespace-pre-wrap line-clamp-5 flex-1 break-words">
                {note.content}
              </p>
              
              <div className="mt-auto pt-sm border-t border-border-default mt-sm">
                <p className="text-xs text-tertiary">
                  Diperbarui: {new Date(note.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal / Editor */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content w-[90%] max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="modal-header border-none pb-0">
                <input 
                  name="title" 
                  type="text" 
                  placeholder="Judul Catatan" 
                  className="w-full bg-transparent text-2xl font-bold border-none outline-none text-primary placeholder:text-muted" 
                  defaultValue={editingNote?.title} 
                  required
                  autoFocus
                />
                <button type="button" onClick={closeModal} className="btn-icon btn-ghost ml-2 shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="modal-body flex-1 overflow-hidden flex flex-col pt-sm">
                <textarea 
                  name="content" 
                  placeholder="Mulai menulis..." 
                  className="w-full flex-1 bg-transparent border-none outline-none text-secondary resize-none"
                  defaultValue={editingNote?.content}
                  required
                />
              </div>
              <div className="modal-footer border-none pt-0">
                <button type="submit" disabled={isSubmitting} className="btn btn-primary px-xl">
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}