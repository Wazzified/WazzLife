"use client";

interface GoalFormProps {
  action: (formData: FormData) => void | Promise<void>;
}

export default function GoalForm({ action }: GoalFormProps) {
  return (
    <form action={action} className="form-grid">
      <div className="input-group">
        <label className="input-label">Nama Target</label>
        <input name="name" type="text" placeholder="Cth: Beli Laptop Baru" className="input" required />
      </div>
      <div className="input-group">
        <label className="input-label">Jumlah Target (Rp)</label>
        <input name="targetAmount" type="number" placeholder="Rp 0" className="input" required min="0" />
      </div>
      <div className="input-group">
        <label className="input-label">Rencana Nabung Harian (Rp)</label>
        <input name="dailyRate" type="number" placeholder="Cth: 15000" className="input" required min="1" />
      </div>
      <button type="submit" className="btn btn-primary mt-sm w-full">
        Simpan Target
      </button>
    </form>
  );
}