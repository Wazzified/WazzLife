"use client";

import { useState } from "react";
import DatePicker from "../components/DatePicker";

export const dynamic = 'force-dynamic';

interface TodoFormProps {
  action: (formData: FormData) => void | Promise<void>;
}

export default function TodoForm({ action }: TodoFormProps) {
  const [dueDate, setDueDate] = useState("");

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