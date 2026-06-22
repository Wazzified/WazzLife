"use client";

import { useState } from "react";
import DatePicker from "../components/DatePicker";

interface GoalPlannerFormProps {
  action: (formData: FormData) => void | Promise<void>;
}

export default function GoalPlannerForm({ action }: GoalPlannerFormProps) {
  const [targetDate, setTargetDate] = useState("");

  return (
    <form action={action} className="form-grid">
      <div className="input-group">
        <label className="input-label">Nama Tujuan</label>
        <input name="title" type="text" placeholder="Cth: Belajar Bahasa Jepang" className="input" required />
      </div>
      <div className="input-group">
        <label className="input-label">Deskripsi</label>
        <textarea name="description" placeholder="Opsional" className="input" rows={3}></textarea>
      </div>
      <div className="input-group">
        <label className="input-label">Tenggat Waktu</label>
        <DatePicker name="targetDate" value={targetDate} onChange={setTargetDate} />
      </div>
      <button type="submit" className="btn btn-primary mt-sm w-full">
        Simpan Tujuan
      </button>
    </form>
  );
}