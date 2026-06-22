"use client";

import DatePickerLib from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { id } from "date-fns/locale/id";

registerLocale("id", id);

interface DatePickerProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}

export default function DatePicker({ name, value, onChange, required, placeholder }: DatePickerProps) {
  const selectedDate = value ? new Date(value) : null;

  return (
    <div className="custom-datepicker-wrapper">
      <input type="hidden" name={name} value={value} required={required} />
      <DatePickerLib
        selected={selectedDate}
        onChange={(date: Date | null) => {
          if (date) {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            onChange(`${yyyy}-${mm}-${dd}`);
          } else {
            onChange("");
          }
        }}
        dateFormat="d MMMM yyyy"
        locale="id"
        placeholderText={placeholder || "Pilih tanggal"}
        className="input"
        calendarClassName="wazzlife-datepicker"
        showPopperArrow={false}
      />
    </div>
  );
}