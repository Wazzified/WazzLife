import { revalidatePath } from "next/cache";
import { createEvent, deleteEvent, getEvent } from "../action/event";
import EmptyState from "../components/EmptyState";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const session = await auth();
  const isDemo = session?.user?.role === "demo";

  const events = await getEvent();

  async function handleCreate(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const note = formData.get("note") as string;

    await createEvent({ title, date, note });
    revalidatePath("/calendar");
    revalidatePath("/dashboard");
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteEvent(id);
    revalidatePath("/calendar");
    revalidatePath("/dashboard");
  }

  // Get current month details for simple calendar grid rendering
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const calendarCells = [];
  
  // Empty cells for days before first of month
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push({ empty: true, date: null, hasEvent: false, isToday: false });
  }
  
  // Actual days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    d.setHours(0,0,0,0);
    
    // Check if has event
    const hasEvent = events.some(e => {
      const eDate = new Date(e.date);
      eDate.setHours(0,0,0,0);
      return eDate.getTime() === d.getTime();
    });
    
    // Check if today
    const t = new Date();
    t.setHours(0,0,0,0);
    const isToday = t.getTime() === d.getTime();
    
    calendarCells.push({ empty: false, date: i, hasEvent, isToday });
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Kalender</h1>
        <p className="page-subtitle">Jadwal dan pengingat acara penting Anda</p>
      </div>

      <div className="grid-cols-3">
        <div className="form-card md:col-span-1 col-span-3">
          <div className="section-header">
            <h2 className="section-title">Tambah Acara</h2>
          </div>
          
          {isDemo ? (
            <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-border-default rounded-lg bg-bg-input/50">
              <svg className="w-10 h-10 text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <p className="text-sm font-medium text-secondary">Mode Demo Aktif</p>
              <p className="text-xs text-muted mt-1">Anda hanya dapat melihat data.</p>
            </div>
          ) : (
            <form action={handleCreate} className="form-grid">
              <div className="input-group">
                <label className="input-label">Judul</label>
                <input name="title" type="text" placeholder="Cth: Meeting, Ulang Tahun" className="input" required />
              </div>
              <div className="input-group">
                <label className="input-label">Tanggal</label>
                <input name="date" type="date" className="input" required defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="input-group">
                <label className="input-label">Catatan</label>
                <textarea name="note" placeholder="Opsional" className="input" rows={3}></textarea>
              </div>
              <button type="submit" className="btn btn-primary mt-sm w-full">
                Simpan Jadwal
              </button>
            </form>
          )}
        </div>

        <div className="md:col-span-2 col-span-3">
          <div className="card mb-lg">
            <div className="section-header mb-md">
              <h2 className="section-title text-center w-full">
                {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </h2>
            </div>
            
            <div className="calendar-grid">
              <div className="calendar-header-cell">Min</div>
              <div className="calendar-header-cell">Sen</div>
              <div className="calendar-header-cell">Sel</div>
              <div className="calendar-header-cell">Rab</div>
              <div className="calendar-header-cell">Kam</div>
              <div className="calendar-header-cell">Jum</div>
              <div className="calendar-header-cell">Sab</div>
              
              {calendarCells.map((cell, idx) => (
                <div 
                  key={idx} 
                  className={`calendar-cell ${cell.empty ? 'calendar-cell-other-month' : ''} ${cell.isToday ? 'calendar-cell-today' : ''} ${cell.hasEvent ? 'calendar-cell-has-event' : ''}`}
                >
                  {cell.date}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="section-header">
              <h2 className="section-title">Semua Jadwal Mendatang</h2>
            </div>
            
            {events.length === 0 ? (
              <EmptyState 
                title="Kalender kosong" 
                description="Belum ada acara atau jadwal yang disimpan."
                icon={
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                }
              />
            ) : (
              <div className="flex-col gap-sm">
                {events.filter(e => new Date(e.date).getTime() >= new Date().setHours(0,0,0,0)).map(e => (
                  <div key={e.id} className="list-item">
                    <div className="flex items-center gap-md">
                      <div className="flex flex-col items-center justify-center w-12 h-12 rounded bg-bg-input border border-border-default">
                        <span className="text-[10px] text-danger font-bold uppercase">{new Date(e.date).toLocaleDateString('id-ID', { month: 'short' })}</span>
                        <span className="text-lg font-bold leading-none">{new Date(e.date).getDate()}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{e.title}</p>
                        {e.note && <p className="text-xs text-secondary">{e.note}</p>}
                      </div>
                    </div>
                    {!isDemo && (
                      <form action={handleDelete}>
                        <input type="hidden" name="id" value={e.id} />
                        <button type="submit" className="btn-icon btn-ghost text-danger hover:bg-danger/10 rounded-full" title="Hapus jadwal">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}