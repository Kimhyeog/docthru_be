/*
  Warnings:

  - A unique constraint covering the columns `[challengeId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Application_userId_challengeId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Application_challengeId_key" ON "Application"("challengeId");
