/*
  Warnings:

  - You are about to drop the column `tilte` on the `Challenge` table. All the data in the column will be lost.
  - Added the required column `title` to the `Challenge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "tilte",
ADD COLUMN     "title" TEXT NOT NULL;
