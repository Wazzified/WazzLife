import { getJournals } from "../action/journal";
import JournalGrid from "./JournalGrid";
import JournalUploader from "./JournalUploader";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function JournalPage() {
  const session = await auth();
  const isDemo = session?.user?.role === "demo";
  
  const journals = await getJournals();

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Journal</h1>
        <p className="page-subtitle">Abadikan momen dan memori penting setiap hari</p>
      </div>

      <JournalUploader isDemo={isDemo} />
      
      <div className="section-header mt-xl">
        <h2 className="section-title">Galeri Memori</h2>
      </div>
      
      <JournalGrid journals={journals} isDemo={isDemo} />
    </div>
  );
}