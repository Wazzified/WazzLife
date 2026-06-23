import { createSavingGoal, addDailySaving, deleteSavingGoal, getSavingGoals } from "../action/savinggoal";
import EmptyState from "../components/EmptyState";
import GoalForm from "./GoalForm";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function GoalsPage() {
    const session = await auth();
    const isDemo = session?.user?.role === "demo";
    
    const goals = await getSavingGoals();

    async function handleCreateGoal(formData: FormData) {
        "use server"
        const name = formData.get("name") as string;
        const targetAmount = parseFloat(formData.get("targetAmount") as string);
        const dailyRate = parseFloat(formData.get("dailyRate") as string);

        await createSavingGoal({ name, targetAmount, dailyRate });
    }

    async function handleAddDaily(formData: FormData) {
        "use server"
        const id = formData.get("id") as string;
        await addDailySaving(id);
    }

    async function handleDelete(formData: FormData) {
        "use server"
        const id = formData.get("id") as string;
        await deleteSavingGoal(id);
    }

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Tabungan</h1>
                <p className="page-subtitle">Pantau target tabungan Anda</p>
            </div>

            <div className="grid-cols-3">
                <div className="form-card md:col-span-1 col-span-3">
                    <div className="section-header">
                        <h2 className="section-title">Tambah Target Baru</h2>
                    </div>
                    
                    {isDemo ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-border-default rounded-lg bg-bg-input/50">
                            <svg className="w-10 h-10 text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            <p className="text-sm font-medium text-secondary">Mode Demo Aktif</p>
                            <p className="text-xs text-muted mt-1">Anda hanya dapat melihat data.</p>
                        </div>
                    ) : (
                        <GoalForm action={handleCreateGoal} />
                    )}
                </div>

                <div className="md:col-span-2 col-span-3">
                    <div className="card">
                        <div className="section-header">
                            <h2 className="section-title">Semua Target Tabungan</h2>
                        </div>
                        {goals.length === 0 ? (
                            <EmptyState
                                title="Belum ada target tabungan"
                                description="Mulai menabung untuk masa depan dengan menetapkan target."
                                icon={
                                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <circle cx="12" cy="12" r="6" />
                                        <circle cx="12" cy="12" r="2" />
                                    </svg>
                                }
                            />
                        ) : (
                            <div className="flex-col gap-md">
                                {goals.map((g) => (
                                    <div key={g.id} className="list-item flex-col items-stretch p-0 overflow-hidden">
                                        <div className="p-md">
                                            <div className="flex justify-between items-start mb-sm">
                                                <div>
                                                    <h3 className="font-semibold">{g.name}</h3>
                                                    <p className="text-xs text-secondary mt-1">
                                                        Nabung Rp {g.dailyRate.toLocaleString("id-ID")} / hari
                                                    </p>
                                                    {!g.isCompleted && g.estimatedDays !== null && (
                                                        <p className="text-xs text-accent mt-1 font-medium">
                                                            Estimasi {g.estimatedDays} hari lagi
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-sm">
                                                    {g.isCompleted && (
                                                        <span className="badge badge-success">Tercapai 🎉</span>
                                                    )}
                                                    {!isDemo && (
                                                        <form action={handleDelete}>
                                                            <input type="hidden" name="id" value={g.id} />
                                                            <button
                                                                type="submit"
                                                                className="flex items-center justify-center w-8 h-8 rounded-full text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
                                                                aria-label="Hapus target"
                                                                title="Hapus target"
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

                                            <div className="flex justify-between text-sm mb-xs">
                                                <span className="text-secondary">Terkumpul: Rp {g.currentAmount.toLocaleString("id-ID")}</span>
                                                <span className="font-medium">Rp {g.targetAmount.toLocaleString("id-ID")}</span>
                                            </div>

                                            <div className="progress-bar mb-md">
                                                <div
                                                    className={`progress-fill ${g.isCompleted ? 'progress-fill-success' : ''}`}
                                                    style={{ width: `${g.percentage}%` }}
                                                ></div>
                                            </div>

                                            {!g.isCompleted && !isDemo && (
                                                <form action={handleAddDaily}>
                                                    <input type="hidden" name="id" value={g.id} />
                                                    <button type="submit" className="btn btn-secondary w-full">
                                                        Nabung Hari Ini (+Rp {g.dailyRate.toLocaleString("id-ID")})
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
        </div>
    );
}