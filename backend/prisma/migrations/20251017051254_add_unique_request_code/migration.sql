/*
  Warnings:

  - You are about to alter the column `description` on the `requests` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `summary` on the `requests` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - A unique constraint covering the columns `[code]` on the table `requests` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "requests" ALTER COLUMN "description" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "summary" SET DATA TYPE VARCHAR(50);

-- CreateIndex
CREATE UNIQUE INDEX "requests_code_key" ON "requests"("code");
