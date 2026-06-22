import { getNotes } from "../action/note";
import NotesDashboard from "./NotesDashboard";

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <div className="animate-fade-in">
      <NotesDashboard initialNotes={notes} />
    </div>
  );
}
