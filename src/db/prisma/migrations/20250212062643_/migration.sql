/*
  Warnings:

  - You are about to drop the column `deadLine` on the `Challenge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "deadLine",
ADD COLUMN     "deadline" TIMESTAMP(3);
