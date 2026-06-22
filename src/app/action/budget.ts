"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBudget(data: { category : string; limit: number}){
    const budget = await prisma.budget.upsert({
        where: { category: data.category},
        update: { limit: data.limit },
        create: { category: data.category, limit: data.limit },
    });
    return budget;
}

export async function deleteBudget(category: string) {
    await prisma.budget.delete({ where: { category } });
    revalidatePath("/budget");
    revalidatePath("/dashboard");
}

export async function getBudgets() {
  const budgets = await prisma.budget.findMany();
  const transactions = await prisma.transaction.findMany({
    where: { type: "expense" },
  });

  return budgets.map((budget) => {
    const spent = transactions
      .filter((t) => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    const percentage = (spent / budget.limit) * 100;

    return {
      ...budget,
      spent,
      percentage,
      isOverLimit: spent > budget.limit,
      isNearLimit: percentage >= 80 && percentage <= 100,
    };
  });
}
