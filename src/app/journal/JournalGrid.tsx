"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteJournal } from "../action/journal";
import EmptyState from "../components/EmptyState";

interface JournalProps {
  journals: {
    id: string;
    imageUrl: string;
    caption: string;
    date: Date;
  }[];
}

export default function JournalGrid({ journals }: JournalProps) {
  const router = useRouter();
  const [selectedJournal, setSelectedJournal] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const closeModal = () => setSelectedJournal(null);

  const handleDelete = async () => {
    if (!selectedJournal || isDeleting) return;
    
    if (confirm("Yakin ingin menghapus foto ini?")) {
      setIsDeleting(true);
      try {
        await deleteJournal(selectedJournal.id, selectedJournal.imageUrl);
        closeModal();
        router.refresh();
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (journals.length === 0) {
    return (
      <EmptyState 
        title="Belum ada memori" 
        description="Unggah foto pertama Anda untuk memulai jurnal."
        icon={
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        }
      />
    );
  }

  return (
    <>
      <div className="journal-grid stagger">
        {journals.map((journal) => (
          <div 
            key={journal.id} 
            className="journal-card animate-slide-up"
            onClick={() => setSelectedJournal(journal)}
          >
            <img src={journal.imageUrl} alt={journal.caption} loading="lazy" />
            <div className="journal-card-overlay">
              <p className="truncate">{journal.caption}</p>
              <span>{new Date(journal.date).toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedJournal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="font-semibold">{new Date(selectedJournal.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <button onClick={closeModal} className="btn-icon btn-ghost">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="p-0 bg-black flex justify-center">
              <img 
                src={selectedJournal.imageUrl} 
                alt={selectedJournal.caption} 
                className="max-h-[60vh] object-contain"
              />
            </div>
            
            <div className="modal-body">
              <p className="text-lg leading-relaxed">{selectedJournal.caption}</p>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={handleDelete} 
                disabled={isDeleting}
                className="btn btn-danger"
              >
                {isDeleting ? "Menghapus..." : "Hapus Foto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
