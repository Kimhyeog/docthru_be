/*
  Warnings:

  - A unique constraint covering the columns `[userId,challengeId]` on the table `Participate` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Work_userId_challengeId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Participate_userId_challengeId_key" ON "Participate"("userId", "challengeId");
