import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Fetch data in parallel for dashboard
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    transactions,
    allGoals,
    todoStats,
    habits,
    upcomingEvents,
    latestJournal
  ] = await Promise.all([
    // 1. Transactions this month
    prisma.transaction.findMany({
      where: { date: { gte: startOfMonth } }
    }),
    
    // 2. All goals (filter active ones in JS, since we can't compare two columns directly in findMany)
    prisma.savingGoal.findMany({
      take: 10,
      orderBy: { createdAt: "desc" }
    }),

    // 3. Todo stats
    prisma.todo.groupBy({
      by: ['done'],
      _count: { id: true }
    }),

    // 4. Habits with today's logs
    prisma.habit.findMany({
      include: {
        logs: {
          where: { date: { gte: today } }
        }
      }
    }),

    // 5. Upcoming events
    prisma.event.findMany({
      where: { date: { gte: today } },
      take: 4,
      orderBy: { date: "asc" }
    }),

    // 6. Latest journal
    prisma.journal.findFirst({
      orderBy: { date: "desc" }
    })
  ]);

  // Filter active (not yet completed) goals, take top 3
  const activeGoals = allGoals
    .filter((g) => g.currentAmount < g.targetAmount)
    .slice(0, 3);

  // Calculations
  const incomeThisMonth = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenseThisMonth = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  
  const pendingTodos = todoStats.find(t => !t.done)?._count.id || 0;
  const completedTodos = todoStats.find(t => t.done)?._count.id || 0;

  const habitsDoneToday = habits.filter(h => h.logs.length > 0).length;
  const totalHabits = habits.length;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Ringkasan aktivitas dan progress Anda</p>
      </div>

      <div className="dashboard-grid">
        {/* ROW 1: Keuangan & Habit */}
        <div className="dashboard-card-wide">
          <Card className="h-full bg-gradient-to-br from-bg-card to-bg-card-hover border-border-accent relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.25 1.64-1.74 0-2.1-.96-2.17-1.92H8.01c.08 1.81 1.25 3.11 2.89 3.52V20h2.34v-1.67c1.76-.32 2.94-1.41 2.94-2.92 0-2.38-1.96-3.08-3.87-3.55z"/></svg>
            </div>
            <h3 className="text-secondary font-medium mb-1">Keuangan Bulan Ini</h3>
            <div className="flex items-end gap-md mb-xl">
              <span className="text-3xl font-bold text-primary">Rp {(incomeThisMonth - expenseThisMonth).toLocaleString("id-ID")}</span>
              <span className="text-sm text-tertiary mb-2">Netto</span>
            </div>
            
            <div className="grid-cols-2">
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider mb-1">Pemasukan</p>
                <p className="font-semibold text-success">+ Rp {incomeThisMonth.toLocaleString("id-ID")}</p>
              </div>
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider mb-1">Pengeluaran</p>
                <p className="font-semibold text-danger">- Rp {expenseThisMonth.toLocaleString("id-ID")}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-md">
              <h3 className="font-medium">Habit Hari Ini</h3>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-primary-glow text-accent-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10c0 4-4 6-5 9-1-3-5-5-5-9a5 5 0 0 1 1.5-3.5C9.5 5.5 11 5 12 2z"/></svg>
              </div>
            </div>
            
            <div className="flex items-end gap-xs mb-sm">
              <span className="text-4xl font-bold">{habitsDoneToday}</span>
              <span className="text-secondary mb-1">/ {totalHabits} selesai</span>
            </div>
          </div>
          
          <div>
            <div className="progress-bar mb-sm">
              <div 
                className="progress-fill" 
                style={{ width: `${totalHabits > 0 ? (habitsDoneToday/totalHabits)*100 : 0}%` }}
              />
            </div>
            <Link href="/habit" className="text-xs text-accent-primary hover:underline">Kelola Habit &rarr;</Link>
          </div>
        </Card>

        {/* ROW 2: Todo & Goals */}
        <Card>
          <div className="flex justify-between items-start mb-md">
            <h3 className="font-medium">To-Do List</h3>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warning/10 text-warning">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </div>
          </div>
          <div className="flex items-center justify-between mb-lg">
            <div>
              <p className="text-3xl font-bold text-warning">{pendingTodos}</p>
              <p className="text-xs text-secondary">Tugas pending</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-success">{completedTodos}</p>
              <p className="text-xs text-secondary">Selesai</p>
            </div>
          </div>
          <Link href="/todo" className="btn btn-secondary w-full">Lihat Tugas</Link>
        </Card>

        <Card className="dashboard-card-wide">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-medium">Target Tabungan Aktif</h3>
            <Link href="/goals" className="text-xs text-accent-primary hover:underline">Semua Target &rarr;</Link>
          </div>
          
          {activeGoals.length === 0 ? (
            <p className="text-sm text-tertiary text-center py-6">Tidak ada target tabungan aktif.</p>
          ) : (
            <div className="flex-col gap-sm">
              {activeGoals.map(g => {
                const percent = Math.min((g.currentAmount / g.targetAmount) * 100, 100);
                return (
                  <div key={g.id} className="list-item">
                    <div className="flex-1">
                      <div className="flex justify-between mb-xs">
                        <span className="font-medium text-sm">{g.name}</span>
                        <span className="text-xs text-secondary">{Math.round(percent)}%</span>
                      </div>
                      <div className="progress-bar" style={{ height: '4px' }}>
                        <div className="progress-fill" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* ROW 3: Events & Journal */}
        <Card className="dashboard-card-wide">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-medium">Jadwal Mendatang</h3>
            <Link href="/calendar" className="text-xs text-accent-primary hover:underline">Buka Kalender &rarr;</Link>
          </div>
          
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-tertiary text-center py-6">Tidak ada jadwal dalam waktu dekat.</p>
          ) : (
            <div className="flex-col gap-sm">
              {upcomingEvents.map(e => (
                <div key={e.id} className="list-item py-2">
                  <div className="flex items-center gap-md">
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded bg-bg-input border border-border-default">
                      <span className="text-[10px] text-danger font-bold uppercase">{new Date(e.date).toLocaleDateString('id-ID', { month: 'short' })}</span>
                      <span className="text-lg font-bold leading-none">{new Date(e.date).getDate()}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{e.title}</p>
                      {e.note && <p className="text-xs text-secondary truncate max-w-[200px]">{e.note}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-0 overflow-hidden relative group">
          {latestJournal ? (
            <>
              <img 
                src={latestJournal.imageUrl} 
                alt="Latest journal" 
                className="w-full h-full object-cover min-h-[200px]" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-md transition-opacity">
                <div className="flex items-center gap-2 mb-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                  <span className="text-xs text-white/80 font-medium tracking-wide uppercase">Jurnal Terbaru</span>
                </div>
                <p className="text-white text-sm font-medium line-clamp-2">{latestJournal.caption}</p>
                
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                  <Link href="/journal" className="btn btn-primary">Lihat Jurnal</Link>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full min-h-[200px] flex flex-col items-center justify-center p-lg text-center bg-bg-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted mb-sm">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              <p className="text-sm text-secondary mb-md">Belum ada memori yang disimpan.</p>
              <Link href="/journal" className="btn btn-secondary btn-sm">Mulai Jurnal</Link>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}
