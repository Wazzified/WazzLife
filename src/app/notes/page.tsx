import { getNotes } from "../action/note";
import NotesDashboard from "./NotesDashboard";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function NotesPage() {
  const session = await auth();
  const isDemo = session?.user?.role === "demo";
  
  const notes = await getNotes();

  return (
    <div className="animate-fade-in">
      <NotesDashboard initialNotes={notes} isDemo={isDemo} />
    </div>
  );
}