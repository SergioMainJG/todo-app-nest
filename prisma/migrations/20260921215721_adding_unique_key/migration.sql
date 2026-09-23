/*
  Warnings:

  - A unique constraint covering the columns `[title,author]` on the table `Todos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Todos_title_author_key" ON "Todos"("title", "author");
