"use server"
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEvent(data: {
    title: string;
    date: string;
    note?: string;
}) {
    const event = await prisma.event.create({
        data: {
            title: data.title,
            date: new Date(data.date),
            note: data.note,
        },
    });
    return event;
}

export async function deleteEvent(id: string) {
    await prisma.event.delete({ where: { id } });
    revalidatePath("/calendar");
    revalidatePath("/dashboard");
}

export async function getEvent() {
    const events = await prisma.event.findMany({
        orderBy: { date: "asc" }
    });
    return events;
}