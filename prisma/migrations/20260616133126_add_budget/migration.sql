-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "limit" DOUBLE PRECISION NOT NULL,
    "period" TEXT NOT NULL DEFAULT 'montly',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Budget_category_key" ON "Budget"("category");
