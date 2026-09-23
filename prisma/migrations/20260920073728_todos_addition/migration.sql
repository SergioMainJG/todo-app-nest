-- CreateEnum
CREATE TYPE "Status" AS ENUM ('INACTIVE', 'IN_PROGRESS', 'CANCELED', 'DONE');

-- CreateTable
CREATE TABLE "Todos" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'INACTIVE',
    "author" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Todos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Todos_title_key" ON "Todos"("title");

-- AddForeignKey
ALTER TABLE "Todos" ADD CONSTRAINT "Todos_author_fkey" FOREIGN KEY ("author") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
