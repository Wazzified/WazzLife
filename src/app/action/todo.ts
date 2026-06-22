"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTodo(data: {
    title: string;
    priority: string;
    dueDate?: string;
}) {
    const todo = await prisma.todo.create({
        data: {
            title: data.title,
            priority: data.priority,
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
        },
    });
    return todo;
}

export async function toggleTodo (id: string, done:boolean){
    const todo = await prisma.todo.update({
        where : { id },
        data: { done: !done },
    });
    return todo;
}

export async function deleteTodo(id: string){
    await prisma.todo.delete({ where: { id } });
    revalidatePath("/todo");
    revalidatePath("/dashboard");
}

export async function getTodos(){
    const todos = await prisma.todo.findMany({
        orderBy: [{ done: "asc"}, {dueDate: "asc"}],
    });
    return todos;
}


