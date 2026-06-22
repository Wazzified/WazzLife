"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getNotes() {
  const notes = await prisma.note.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
  return notes;
}

export async function createNote(data: { title: string; content: string }) {
  const note = await prisma.note.create({
    data: {
      title: data.title || "Untitled",
      content: data.content,
    },
  });
  revalidatePath("/notes");
  return note;
}

export async function updateNote(id: string, data: { title: string; content: string }) {
  const note = await prisma.note.update({
    where: { id },
    data: {
      title: data.title || "Untitled",
      content: data.content,
    },
  });
  revalidatePath("/notes");
  return note;
}

export async function deleteNote(id: string) {
  await prisma.note.delete({
    where: { id },
  });
  revalidatePath("/notes");
}
