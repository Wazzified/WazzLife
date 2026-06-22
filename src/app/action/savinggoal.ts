"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSavingGoal(data: {
  name: string;
  targetAmount: number;
  dailyRate: number;
}) {
  const goal = await prisma.savingGoal.create({
    data: {
      name: data.name,
      targetAmount: data.targetAmount,
      dailyRate: data.dailyRate,
    },
  });
  revalidatePath("/goals");
  revalidatePath("/dashboard");
  return goal;
}

export async function deleteSavingGoal(id: string) {
  await prisma.savingGoal.delete({ where: { id } });
  revalidatePath("/goals");
  revalidatePath("/dashboard");
}

export async function addDailySaving(id: string) {
  const goal = await prisma.savingGoal.findUnique({ where: { id } });
  if (!goal) return null;

  const updated = await prisma.savingGoal.update({
    where: { id },
    data: {
      currentAmount: { increment: goal.dailyRate },
    },
  });
  revalidatePath("/goals");
  revalidatePath("/dashboard");
  return updated;
}

export async function addSavingProgress(id: string, amount: number) {
  const goal = await prisma.savingGoal.update({
    where: { id },
    data: {
      currentAmount: { increment: amount },
    },
  });
  revalidatePath("/goals");
  revalidatePath("/dashboard");
  return goal;
}

export async function getSavingGoals() {
  const goals = await prisma.savingGoal.findMany({
    orderBy: { createdAt: "desc" },
  });

  return goals.map((goal) => {
    const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
    const estimatedDays =
      goal.dailyRate > 0 ? Math.ceil(remaining / goal.dailyRate) : null;

    return {
      ...goal,
      percentage: Math.min((goal.currentAmount / goal.targetAmount) * 100, 100),
      isCompleted: goal.currentAmount >= goal.targetAmount,
      remaining,
      estimatedDays,
    };
  });
}