"use client";

import { useState } from "react";
import DatePicker from "../components/DatePicker";

interface TodoFormProps {
  action: (formData: FormData) => void | Promise<void>;
  isDemo?: boolean; // ← TAMBAHIN INI
}

export default function TodoForm({ action, isDemo = false }: TodoFormProps) {
  const [dueDate, setDueDate] = useState("");

  if (isDemo) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-border-default rounded-lg bg-bg-input/50">
        <svg className="w-10 h-10 text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        <p className="text-sm font-medium text-secondary">Mode Demo Aktif</p>
        <p className="text-xs text-muted mt-1">Anda hanya dapat melihat data.</p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <div className="form-row">
        <label className="input-label">Judul Tugas</label>
        <input name="title" type="text" placeholder="Masukkan judul..." className="input" required />
      </div>

      <div className="form-row">
        <label className="input-label">Prioritas</label>
        <select name="priority" className="input select" required>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="form-row">
        <label className="input-label">Tenggat Waktu</label>
        <DatePicker name="dueDate" value={dueDate} onChange={setDueDate} />
      </div>

      <button type="submit" className="btn btn-primary w-full mt-sm">
        Tambah Tugas
      </button>
    </form>
  );
}