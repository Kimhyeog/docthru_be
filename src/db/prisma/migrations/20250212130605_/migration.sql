/*
  Warnings:

  - The `progress` column on the `Challenge` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Progress" AS ENUM ('PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "progress",
ADD COLUMN     "progress" "Progress" DEFAULT 'PROGRESS';
