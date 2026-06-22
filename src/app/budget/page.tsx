import { createBudget, deleteBudget, getBudgets } from "../action/budget";
import { revalidatePath } from "next/cache";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";

export default async function BudgetPage() {
    const budgets = await getBudgets();

    async function handleSubmit(formData: FormData) {
        "use server"
        const category = formData.get("category") as string;
        const limit = parseFloat(formData.get("limit") as string);
        await createBudget({ category, limit });
        revalidatePath("/budget");
        revalidatePath("/dashboard");
    }

    async function handleDelete(formData: FormData) {
        "use server"
        const category = formData.get("category") as string;
        await deleteBudget(category);
    }

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Budget / Anggaran</h1>
                <p className="page-subtitle">Kelola dan pantau anggaran keuangan Anda</p>
            </div>

            <div className="grid-cols-3">
                <div className="col-span-1">
                    <div className="form-card">
                        <div className="section-header mb-sm">
                            <h2 className="text-lg font-bold">Buat Anggaran Baru</h2>
                        </div>
                        <form action={handleSubmit} className="flex flex-col gap-sm">
                            <div className="form-row">
                                <div className="w-full">
                                    <label className="input-label mb-xs block">Kategori</label>
                                    <input name="category" type="text" placeholder="Misal: Makan, Transport" className="input" required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="w-full">
                                    <label className="input-label mb-xs block">Batas Anggaran</label>
                                    <input name="limit" type="number" placeholder="Rp 0" className="input" required />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-full mt-sm">
                                Simpan Anggaran
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-span-2">
                    {budgets.length === 0 ? (
                        <EmptyState 
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                </svg>
                            }
                            title="Belum ada anggaran" 
                            description="Mulai buat anggaran pertama Anda untuk memantau pengeluaran."
                        />
                    ) : (
                        <div className="flex flex-col gap-sm">
                            {budgets.map((b) => (
                                <Card key={b.id} className="list-item">
                                    <div className="flex justify-between items-center mb-sm">
                                        <h3 className="font-medium text-primary">{b.category}</h3>
                                        <div className="flex items-center gap-sm">
                                            <p className="text-secondary text-sm">
                                                Rp {b.spent.toLocaleString("id-ID")} / Rp {b.limit.toLocaleString("id-ID")}
                                            </p>
                                            <form action={handleDelete}>
                                                <input type="hidden" name="category" value={b.category} />
                                                <button
                                                    type="submit"
                                                    className="flex items-center justify-center w-8 h-8 rounded-full text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
                                                    aria-label="Hapus anggaran"
                                                    title="Hapus anggaran"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                        <line x1="10" y1="11" x2="10" y2="17" />
                                                        <line x1="14" y1="11" x2="14" y2="17" />
                                                    </svg>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="progress-bar">
                                        <div 
                                            className={`progress-fill ${
                                                b.isOverLimit ? "progress-fill-danger" : b.isNearLimit ? "progress-fill-warning" : "progress-fill-success"
                                            }`}
                                            style={{ width: `${Math.min(b.percentage, 100)}%` }}
                                        ></div>
                                    </div>
                                    {b.isOverLimit && (
                                        <p className="text-sm text-red-500 mt-2">Sudah melebihi budget</p>
                                    )}
                                    {b.isNearLimit && !b.isOverLimit && (
                                        <p className="text-sm text-yellow-500 mt-2">Mendekati budget</p>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}