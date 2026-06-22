"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTransaction(formData: {
  type: string;
  amount: number;
  category: string;
  note?: string;
}) {
  const transaction = await prisma.transaction.create({
    data: {
      type: formData.type,
      amount: formData.amount,
      category: formData.category,
      note: formData.note,
    },
  });
  return transaction;
}

export async function deleteTransaction(id: string) {
  await prisma.transaction.delete({ where: { id } });
  revalidatePath("/expense");
  revalidatePath("/dashboard");
}

export async function getTransactions() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { date: "desc" },
  });
  return transactions;
}