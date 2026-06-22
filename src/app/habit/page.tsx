import { revalidatePath } from "next/cache";
import { createHabit, deleteHabit, getHabits } from "../action/habit";
import HabitCard from "./HabitCard";
import EmptyState from "../components/EmptyState";

export default async function HabitPage() {
  const habits = await getHabits();

  async function handleCreate(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const frequencyInfo = formData.get("frequency") as string;
    
    // Parse frequency value (e.g. "3x_week")
    let frequency = "daily";
    let frequencyTarget = 7;
    
    if (frequencyInfo !== "daily") {
      frequency = frequencyInfo;
      frequencyTarget = parseInt(frequencyInfo.split("x")[0], 10);
    }
    
    await createHabit({ name, frequency, frequencyTarget });
    revalidatePath("/habit");
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteHabit(id);
    revalidatePath("/habit");
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Habit Tracker</h1>
        <p className="page-subtitle">Bangun kebiasaan baik dan pantau konsistensi Anda</p>
      </div>

      <div className="form-card mb-xl">
        <div className="section-header">
          <h2 className="section-title">Tambah Habit Baru</h2>
        </div>
        <form action={handleCreate} className="form-row">
          <div className="input-group">
            <input name="name" type="text" placeholder="Nama kebiasaan (cth: Baca buku, Olahraga)" className="input" required />
          </div>
          <div className="input-group" style={{ maxWidth: '200px' }}>
            <select name="frequency" className="select" required>
              <option value="daily">Setiap Hari</option>
              <option value="1x_week">1x Seminggu</option>
              <option value="3x_week">3x Seminggu</option>
              <option value="5x_week">5x Seminggu</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Tambah
          </button>
        </form>
      </div>

      {habits.length === 0 ? (
        <EmptyState 
          title="Belum ada habit" 
          description="Tambahkan kebiasaan pertama yang ingin Anda bangun mulai hari ini."
          icon={
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10c0 4-4 6-5 9-1-3-5-5-5-9a5 5 0 0 1 1.5-3.5C9.5 5.5 11 5 12 2z" />
            </svg>
          }
        />
      ) : (
        <div className="grid-cols-3">
          {habits.map((habit) => (
            <div key={habit.id} className="relative group">
              <HabitCard 
                id={habit.id}
                name={habit.name}
                frequency={habit.frequency}
                streak={habit.streak}
                completionRate={habit.completionRate}
                logs={habit.logs}
              />
              <form action={handleDelete} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <input type="hidden" name="id" value={habit.id} />
                <button type="submit" className="btn-icon btn-ghost text-danger hover:bg-danger/10 rounded-full" title="Hapus habit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
