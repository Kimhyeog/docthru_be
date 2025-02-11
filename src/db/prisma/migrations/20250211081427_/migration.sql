/*
  Warnings:

  - The values [DELTED] on the enum `ApplicationStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `invaildatedAt` on the `Application` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ApplicationStatus_new" AS ENUM ('WAITING', 'ACCEPTED', 'REJECTED', 'DELETED');
ALTER TABLE "Application" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Application" ALTER COLUMN "status" TYPE "ApplicationStatus_new" USING ("status"::text::"ApplicationStatus_new");
ALTER TYPE "ApplicationStatus" RENAME TO "ApplicationStatus_old";
ALTER TYPE "ApplicationStatus_new" RENAME TO "ApplicationStatus";
DROP TYPE "ApplicationStatus_old";
ALTER TABLE "Application" ALTER COLUMN "status" SET DEFAULT 'WAITING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_challengeId_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "invaildatedAt",
ADD COLUMN     "invalidatedAt" TIMESTAMP(3),
ALTER COLUMN "challengeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE SET NULL ON UPDATE CASCADE;
