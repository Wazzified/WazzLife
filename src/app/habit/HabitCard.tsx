"use client";

import { useState } from "react";
import { toggleHabitLog } from "../action/habit";
import { useRouter } from "next/navigation";

interface HabitLog {
  id: string;
  date: Date;
}

interface HabitCardProps {
  id: string;
  name: string;
  frequency: string;
  streak: number;
  completionRate: number;
  logs: HabitLog[];
  isDemo?: boolean; // ← TAMBAHIN INI
}

export default function HabitCard({ id, name, frequency, streak, completionRate, logs, isDemo = false }: HabitCardProps) {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);

  // Generate last 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const getLogForDate = (date: Date) => {
    return logs.find(log => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === date.getTime();
    });
  };

  const handleToggle = async (date: Date) => {
    if (isToggling || isDemo) return; // ← CEK ISDEMO
    setIsToggling(true);
    try {
      await toggleHabitLog(id, date);
      router.refresh();
    } finally {
      setIsToggling(false);
    }
  };

  const todayIsLogged = getLogForDate(today) !== undefined;

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-md">
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-xs text-tertiary uppercase tracking-wider">{frequency.replace("_", " ")}</p>
        </div>
        {streak > 0 && (
          <div className="streak-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10c0 4-4 6-5 9-1-3-5-5-5-9a5 5 0 0 1 1.5-3.5C9.5 5.5 11 5 12 2z" />
            </svg>
            {streak}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-lg">
        <div className="habit-week-grid">
          {last7Days.map((date, i) => {
            const isLogged = getLogForDate(date);
            const isToday = date.getTime() === today.getTime();
            
            return (
              <div 
                key={i} 
                onClick={() => handleToggle(date)}
                className={`habit-day-cell habit-day-toggle ${isLogged ? 'habit-day-done' : 'habit-day-empty'} ${isToday ? 'habit-day-today' : ''} ${isDemo ? 'cursor-not-allowed opacity-60' : ''}`}
                title={isDemo ? "Mode demo tidak bisa mengubah habit" : date.toLocaleDateString('id-ID')}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>
        
        <button 
          onClick={() => handleToggle(today)}
          disabled={isToggling || isDemo}
          className={`btn btn-sm ${todayIsLogged ? 'btn-ghost' : 'btn-primary'} ${isDemo ? 'opacity-60 cursor-not-allowed' : ''}`}
          title={isDemo ? "Mode demo tidak bisa mengubah habit" : ""}
        >
          {todayIsLogged ? 'Batal' : 'Selesai'}
        </button>
      </div>

      <div className="mt-md">
        <div className="flex justify-between text-xs mb-xs">
          <span className="text-secondary">Penyelesaian (30 hari)</span>
          <span className="font-semibold">{completionRate}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${completionRate}%`, background: `var(--accent-gradient)` }}
          />
        </div>
      </div>
    </div>
  );
}