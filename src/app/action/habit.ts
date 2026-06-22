"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createHabit(data: { name: string; frequency: string; frequencyTarget: number }) {
  const habit = await prisma.habit.create({
    data: {
      name: data.name,
      frequency: data.frequency,
      frequencyTarget: data.frequencyTarget,
    },
  });
  return habit;
}

export async function deleteHabit(id: string) {
  await prisma.habit.delete({ where: { id } });
  revalidatePath("/habit");
  revalidatePath("/dashboard");
}

export async function toggleHabitLog(habitId: string, date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const existingLog = await prisma.habitLog.findFirst({
    where: {
      habitId,
      date: {
        gte: startOfDay,
        lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  });

  if (existingLog) {
    await prisma.habitLog.delete({ where: { id: existingLog.id } });
    return false; // Not done
  } else {
    await prisma.habitLog.create({
      data: {
        habitId,
        date: startOfDay,
      },
    });
    return true; // Done
  }
}

export async function getHabits() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const habits = await prisma.habit.findMany({
    include: {
      logs: {
        where: {
          date: {
            gte: thirtyDaysAgo,
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return habits.map((habit) => {
    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Sort logs descending by date
    const sortedLogs = [...habit.logs].sort((a, b) => b.date.getTime() - a.date.getTime());
    
    let currentDateToCheck = new Date(today);
    
    // Check if today is logged
    const todayLogIndex = sortedLogs.findIndex(log => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === currentDateToCheck.getTime();
    });

    if (todayLogIndex !== -1) {
      streak++;
      currentDateToCheck.setDate(currentDateToCheck.getDate() - 1);
    } else {
      // If today not logged, check if yesterday was logged (streak might still be alive)
      currentDateToCheck.setDate(currentDateToCheck.getDate() - 1);
      const yesterdayLogIndex = sortedLogs.findIndex(log => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === currentDateToCheck.getTime();
      });
      if(yesterdayLogIndex === -1) {
        // Streak broken
      } else {
        // We start streak counting from yesterday
      }
    }
    
    // Continue counting streak backward
    for (const log of sortedLogs) {
      const logDate = new Date(log.date);
      logDate.setHours(0,0,0,0);
      
      if (logDate.getTime() === currentDateToCheck.getTime()) {
        streak++;
        currentDateToCheck.setDate(currentDateToCheck.getDate() - 1);
      } else if (logDate.getTime() < currentDateToCheck.getTime()) {
        break; // Streak broken
      }
    }

    // Calculate completion rate (last 30 days)
    const logsCount = habit.logs.length;
    let expectedLogs = 30;
    if(habit.frequency === "daily") expectedLogs = 30;
    else if(habit.frequency.includes("week")) {
      expectedLogs = Math.ceil(30 / 7) * habit.frequencyTarget;
    }
    const completionRate = Math.min(Math.round((logsCount / expectedLogs) * 100), 100);

    return {
      ...habit,
      streak,
      completionRate,
    };
  });
}
