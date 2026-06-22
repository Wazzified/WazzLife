"use server";

import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";

export async function getJournals() {
  const journals = await prisma.journal.findMany({
    orderBy: { date: "desc" },
  });
  return journals;
}

export async function deleteJournal(id: string, imageUrl: string) {
  // Delete from Vercel Blob
  try {
    if (imageUrl) {
      await del(imageUrl);
    }
  } catch (error) {
    console.error("Failed to delete blob:", error);
    // Proceed to delete DB record even if blob deletion fails
  }

  // Delete from DB
  await prisma.journal.delete({ where: { id } });
}
