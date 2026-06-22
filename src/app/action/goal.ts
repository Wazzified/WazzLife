"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createGoal(data: {
    title: string;
    description?: string;
    targetDate?: string;
}){
    const goal = await prisma.goal.create({
        data: {
            title: data.title,
            description: data.description,
            targetDate: data.targetDate ? new Date(data.targetDate) : null,
        },
    });
    return goal;
}

export async function deleteGoal(id: string) {
    await prisma.goal.delete({ where: { id } });
    revalidatePath("/goal");
    revalidatePath("/dashboard");
}

    export async function addMilestone(goalId: string, title: string){
        const milestone = await prisma.milestone.create({
            data: { title, goalId},
        });
        revalidatePath("/goal");
        revalidatePath("/dashboard");
        return milestone;
    }

export async function deleteMilestone(id: string) {
    await prisma.milestone.delete({ where: { id } });
    revalidatePath("/goal");
    revalidatePath("/dashboard");
}

    export async function toggleMilestone(id: string, done: boolean){
        const milestone = await prisma.milestone.update({
            where: { id },
            data: { done: !done},
        });
        revalidatePath("/goal");
        revalidatePath("/dashboard");
        return milestone;
    }

    export async function getGoals(){
        const goal = await prisma.goal.findMany({
            include: {milestones: true},
            orderBy: {createdAt: "desc"},
        });
    

    return goal.map((goal) => {
        const total = goal.milestones.length;
        const completed = goal.milestones.filter((m) => m.done).length;
        const percentage = total > 0 ? (completed / total) * 100: 0;

        return {...goal, percentage, total, completed};
    });
    }