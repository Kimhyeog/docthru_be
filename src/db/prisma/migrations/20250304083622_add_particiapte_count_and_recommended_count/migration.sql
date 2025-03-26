-- AlterTable
ALTER TABLE "User" ADD COLUMN     "participateCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "recommendedCount" INTEGER NOT NULL DEFAULT 0;
