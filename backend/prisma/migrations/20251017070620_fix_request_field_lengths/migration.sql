/*
  Warnings:

  - You are about to alter the column `description` on the `requests` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1000)` to `VarChar(50)`.
  - You are about to alter the column `summary` on the `requests` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "requests" ALTER COLUMN "description" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "summary" SET DATA TYPE VARCHAR(50);
