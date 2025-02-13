-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GENERAL', 'EXPERT', 'ADMIN');

-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('GENERAL', 'EXPERT');

-- CreateEnum
CREATE TYPE "Field" AS ENUM ('NEXTJS', 'CAREER', 'MODERNJS', 'WEB');

-- CreateEnum
CREATE TYPE "DocType" AS ENUM ('BLOG', 'DOCS');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "grade" "Grade",
ADD COLUMN     "role" "Role";

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "tilte" TEXT NOT NULL,
    "field" "Field" NOT NULL,
    "docType" "DocType" NOT NULL,
    "docUrl" TEXT NOT NULL,
    "deadLine" TIMESTAMP(3) NOT NULL,
    "progress" BOOLEAN NOT NULL DEFAULT false,
    "participants" INTEGER NOT NULL,
    "maxParticipants" INTEGER NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);
