import { getTodos, createTodo, toggleTodo, deleteTodo } from "../action/todo";
import { revalidatePath } from "next/cache";
import TodoForm from "./TodoForm";
import EmptyState from "../components/EmptyState";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function TodoPage() {
  const session = await auth();
  const isDemo = session?.user?.role === "demo";
  
  const todos = await getTodos();

  async function handleCreateTodo(formData: FormData) {
    "use server"
    const title = formData.get("title") as string;
    const priority = formData.get("priority") as "low" | "medium" | "high";
    const dueDate = formData.get("dueDate") as string;

    await createTodo({ 
      title, 
      priority, 
      dueDate: dueDate ? dueDate: undefined 
    });
    revalidatePath("/todo");
  }

  async function handleToggle(formData: FormData) {
    "use server"
    const id = formData.get("id") as string;
    const todo = todos.find(t => t.id === id);
    if (todo) {
      await toggleTodo(id, !todo.done); // ← Fix: kirim 2 argumen
    }
    revalidatePath("/todo");
  }

  async function handleDelete(formData: FormData) {
    "use server"
    const id = formData.get("id") as string;
    await deleteTodo(id);
    revalidatePath("/todo");
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-danger";
      case "medium": return "text-warning";
      case "low": return "text-success";
      default: return "text-secondary";
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">To-Do List</h1>
        <p className="page-subtitle">Kelola tugas dan aktivitas Anda</p>
      </div>

      <div className="grid-cols-3">
        <div className="form-card md:col-span-1 col-span-3">
          <div className="section-header">
            <h2 className="section-title">Tambah Tugas Baru</h2>
          </div>
          <TodoForm action={handleCreateTodo} isDemo={isDemo} />
        </div>

        <div className="md:col-span-2 col-span-3">
          {todos.length === 0 ? (
            <EmptyState
              title="Belum ada tugas"
              description="Mulai tambahkan tugas pertama Anda untuk tetap produktif."
              icon={
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              }
            />
          ) : (
            <div className="flex flex-col gap-sm">
              {todos.map((todo) => (
                <div key={todo.id} className="list-item">
                  <div className="flex items-center gap-md">
                    <form action={handleToggle}>
                      <input type="hidden" name="id" value={todo.id} />
                      <button
                        type="submit"
                        disabled={isDemo}
                        className={`flex items-center justify-center w-6 h-6 rounded border-2 transition-colors ${
                          todo.done
                            ? "bg-success border-success"
                            : "border-border-default hover:border-accent-primary"
                        } ${isDemo ? "cursor-not-allowed opacity-50" : ""}`}
                      >
                        {todo.done && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </button>
                    </form>
                    
                    <div className="flex-1">
                      <p className={`font-medium ${todo.done ? "line-through text-secondary" : "text-primary"}`}>
                        {todo.title}
                      </p>
                      <div className="flex items-center gap-xs mt-1">
                        <span className={`text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                          {todo.priority.toUpperCase()}
                        </span>
                        {todo.dueDate && (
                          <>
                            <span className="text-xs text-secondary">•</span>
                            <span className="text-xs text-secondary">
                              {new Date(todo.dueDate).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                              })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {!isDemo && (
                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={todo.id} />
                      <button
                        type="submit"
                        className="flex items-center justify-center w-8 h-8 rounded-full text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
                        aria-label="Hapus tugas"
                        title="Hapus tugas"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
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
  );
}