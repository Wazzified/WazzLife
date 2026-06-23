import { createGoal, addMilestone, toggleMilestone, deleteGoal, deleteMilestone, getGoals } from "../action/goal";
import { revalidatePath } from "next/cache";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import GoalPlannerForm from "./GoalPlannerForm";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function GoalPage() {
  const session = await auth();
  const isDemo = session?.user?.role === "demo";

  const goals = await getGoals();

  async function handleCreateGoal(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const targetDate = formData.get("targetDate") as string;

    await createGoal({ title, description, targetDate: targetDate || undefined });
    revalidatePath("/goal");
    revalidatePath("/dashboard");
  }

  async function handleAddMilestone(formData: FormData) {
    "use server";
    const goalId = formData.get("goalId") as string;
    const title = formData.get("milestoneTitle") as string;

    await addMilestone(goalId, title);
    revalidatePath("/goal");
    revalidatePath("/dashboard");
  }

  async function handleToggleMilestone(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const done = formData.get("done") === "true";

    await toggleMilestone(id, done);
    revalidatePath("/goal");
    revalidatePath("/dashboard");
  }

  async function handleDeleteGoal(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteGoal(id);
  }

  async function handleDeleteMilestone(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteMilestone(id);
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Goal Planner</h1>
        <p className="page-subtitle">Rencanakan tujuan besar Anda dengan langkah kecil</p>
      </div>

      <div className="grid-cols-3">
        <div className="form-card md:col-span-1 col-span-3">
          <div className="section-header">
            <h2 className="section-title">Buat Tujuan Baru</h2>
          </div>
          
          {isDemo ? (
            <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-border-default rounded-lg bg-bg-input/50">
              <svg className="w-10 h-10 text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <p className="text-sm font-medium text-secondary">Mode Demo Aktif</p>
              <p className="text-xs text-muted mt-1">Anda hanya dapat melihat data.</p>
            </div>
          ) : (
            <GoalPlannerForm action={handleCreateGoal} />
          )}
        </div>

        <div className="md:col-span-2 col-span-3">
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">Daftar Tujuan</h2>
            </div>
            {goals.length === 0 ? (
              <EmptyState 
                title="Belum ada tujuan" 
                description="Tulis tujuan pertama Anda dan bagi menjadi langkah-langkah kecil."
                icon={
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                    <line x1="4" y1="22" x2="4" y2="15" />
                  </svg>
                }
              />
            ) : (
              <div className="flex-col gap-md">
                {goals.map((goal) => (
                  <div key={goal.id} className="list-item flex-col items-stretch p-0 overflow-hidden">
                    <div className="p-md">
                      <div className="flex justify-between items-start mb-sm">
                        <div>
                          <h3 className="font-semibold text-lg">{goal.title}</h3>
                          {goal.description && <p className="text-sm text-secondary mt-1">{goal.description}</p>}
                          {goal.targetDate && (
                            <p className="text-xs text-tertiary mt-2">
                              Tenggat: {new Date(goal.targetDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-sm">
                          {goal.percentage === 100 && goal.total > 0 && (
                            <span className="badge badge-success">Selesai 🎉</span>
                          )}
                          {!isDemo && (
                            <form action={handleDeleteGoal}>
                              <input type="hidden" name="id" value={goal.id} />
                              <button
                                type="submit"
                                className="flex items-center justify-center w-8 h-8 rounded-full text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
                                aria-label="Hapus tujuan"
                                title="Hapus tujuan"
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

                      <div className="flex justify-between text-sm mb-xs mt-md">
                        <span className="text-secondary">Progres</span>
                        <span className="font-medium">{goal.completed} / {goal.total} Milestone</span>
                      </div>

                      <div className="progress-bar mb-md">
                        <div
                          className={`progress-fill ${goal.percentage === 100 ? 'progress-fill-success' : ''}`}
                          style={{ width: `${goal.percentage}%`, background: goal.percentage !== 100 ? 'var(--accent-gradient)' : '' }}
                        ></div>
                      </div>

                      <div className="divider" />

                      <div className="flex-col gap-sm mb-md">
                        {goal.milestones.map((m) => (
                          <div key={m.id} className="flex items-center gap-2">
                            {isDemo ? (
                              <div className="flex items-center gap-3 p-2 rounded-md flex-1">
                                <div className={`checkbox-toggle ${m.done ? 'checkbox-toggle-checked' : ''}`}>
                                  {m.done && (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  )}
                                </div>
                                <span className={`text-sm ${m.done ? "line-through text-tertiary" : "text-primary"}`}>
                                  {m.title}
                                </span>
                              </div>
                            ) : (
                              <form action={handleToggleMilestone} className="flex items-center gap-3 p-2 rounded-md hover:bg-bg-input transition-colors flex-1">
                                <input type="hidden" name="id" value={m.id} />
                                <input type="hidden" name="done" value={String(m.done)} />
                                <button type="submit" className="flex items-center gap-3 text-left w-full">
                                  <div className={`checkbox-toggle ${m.done ? 'checkbox-toggle-checked' : ''}`}>
                                    {m.done && (
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                    )}
                                  </div>
                                  <span className={`text-sm ${m.done ? "line-through text-tertiary" : "text-primary"}`}>
                                    {m.title}
                                  </span>
                                </button>
                              </form>
                            )}
                            {!isDemo && (
                              <form action={handleDeleteMilestone}>
                                <input type="hidden" name="id" value={m.id} />
                                <button
                                  type="submit"
                                  className="flex items-center justify-center w-7 h-7 rounded-full text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
                                  aria-label="Hapus milestone"
                                  title="Hapus milestone"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                  </svg>
                                </button>
                              </form>
                            )}
                          </div>
                        ))}
                      </div>

                      {!isDemo && (
                        <form action={handleAddMilestone} className="flex gap-2">
                          <input type="hidden" name="goalId" value={goal.id} />
                          <input name="milestoneTitle" type="text" placeholder="Tambah langkah baru" className="input flex-1 text-sm py-2" required />
                          <button type="submit" className="btn btn-secondary btn-sm whitespace-nowrap">
                            Tambah
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