/*
  Warnings:

  - The values [DOCS] on the enum `DocType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DocType_new" AS ENUM ('BLOG', 'OFFICIAL');
ALTER TABLE "Challenge" ALTER COLUMN "docType" TYPE "DocType_new" USING ("docType"::text::"DocType_new");
ALTER TYPE "DocType" RENAME TO "DocType_old";
ALTER TYPE "DocType_new" RENAME TO "DocType";
DROP TYPE "DocType_old";
COMMIT;
