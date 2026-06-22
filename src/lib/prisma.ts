import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg ({connectionString: process.env.DATABASE_URL});

const GlobalForPrisma = global as unknown as { prisma: PrismaClient};

export const prisma = GlobalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production"){
    GlobalForPrisma.prisma = prisma;
}
