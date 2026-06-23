import { revalidatePath } from "next/cache";
import { createTransaction, deleteTransaction, getTransactions } from "../action/transaction";
import EmptyState from "../components/EmptyState";
import { auth } from "@/lib/auth"; // Pastikan path ini sesuai (biasanya @/lib/auth atau @/auth)

export const dynamic = 'force-dynamic';

export default async function ExpensePage() {
  const session = await auth();
  const isDemo = session?.user?.role === "demo";

  const transactions = await getTransactions();

  async function handleSubmit(formData: FormData) {
    "use server";
    const type = formData.get("type") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const category = formData.get("category") as string;
    const note = formData.get("note") as string;
    
    await createTransaction({ type, amount, category, note });
    revalidatePath("/expense");
    revalidatePath("/dashboard");
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteTransaction(id);
  }

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Keuangan</h1>
        <p className="page-subtitle">Kelola pemasukan dan pengeluaran Anda</p>
      </div>

      <div className="dashboard-grid mb-xl">
        <div className="stat-card">
          <span className="stat-label">Saldo Saat Ini</span>
          <span className="stat-value">Rp {balance.toLocaleString("id-ID")}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pemasukan</span>
          <span className="stat-value text-success">+ Rp {totalIncome.toLocaleString("id-ID")}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pengeluaran</span>
          <span className="stat-value text-danger">- Rp {totalExpense.toLocaleString("id-ID")}</span>
        </div>
      </div>

      <div className="grid-cols-3">
        <div className="form-card col-span-full lg:col-span-1">
          <div className="section-header">
            <h2 className="section-title">Tambah Transaksi</h2>
          </div>
          
          {isDemo ? (
            <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-border-default rounded-lg bg-bg-input/50">
              <svg className="w-10 h-10 text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <p className="text-sm font-medium text-secondary">Mode Demo Aktif</p>
              <p className="text-xs text-muted mt-1">Anda hanya dapat melihat data.</p>
            </div>
          ) : (
            <form action={handleSubmit} className="form-grid">
              <div className="input-group">
                <label className="input-label">Jenis</label>
                <select name="type" className="select" required>
                  <option value="expense">Pengeluaran</option>
                  <option value="income">Pemasukan</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Jumlah</label>
                <input name="amount" type="number" placeholder="Rp 0" className="input" required min="0" />
              </div>
              <div className="input-group">
                <label className="input-label">Kategori</label>
                <input name="category" type="text" placeholder="Cth: Makanan, Gaji" className="input" required />
              </div>
              <div className="input-group">
                <label className="input-label">Catatan</label>
                <input name="note" type="text" placeholder="Opsional" className="input" />
              </div>
              <button type="submit" className="btn btn-primary mt-sm w-full">
                Simpan Transaksi
              </button>
            </form>
          )}
        </div>

        <div className="card col-span-full lg:col-span-2">
          <div className="section-header">
            <h2 className="section-title">Riwayat Transaksi</h2>
          </div>
          
          {transactions.length === 0 ? (
            <EmptyState 
              title="Belum ada transaksi" 
              description="Catat pemasukan atau pengeluaran pertama Anda untuk mulai memantau keuangan."
              icon={
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              }
            />
          ) : (
            <div className="flex-col gap-sm">
              {transactions.map((t) => (
                <div key={t.id} className="list-item">
                  <div className="flex items-center gap-md">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${t.type === 'income' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`} style={{ backgroundColor: t.type === 'income' ? 'var(--color-success-bg)' : 'var(--color-danger-bg)' }}>
                      {t.type === 'income' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{t.category}</p>
                      <p className="text-xs text-secondary">{t.note || "Tanpa catatan"} • {new Date(t.date).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-sm">
                    <p className={`font-semibold ${t.type === "income" ? "text-success" : "text-danger"}`}>
                      {t.type === "income" ? "+" : "-"} Rp {t.amount.toLocaleString("id-ID")}
                    </p>
                    {!isDemo && (
                      <form action={handleDelete}>
                        <input type="hidden" name="id" value={t.id} />
                        <button
                          type="submit"
                          className="flex items-center justify-center w-8 h-8 rounded-full text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
                          aria-label="Hapus transaksi"
                          title="Hapus transaksi"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}