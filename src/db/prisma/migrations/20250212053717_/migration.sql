/*
  Warnings:

  - Made the column `challengeId` on table `Application` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_challengeId_fkey";

-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "challengeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
