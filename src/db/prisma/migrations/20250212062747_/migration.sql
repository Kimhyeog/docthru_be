/*
  Warnings:

  - Made the column `deadline` on table `Challenge` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Challenge" ALTER COLUMN "deadline" SET NOT NULL;
