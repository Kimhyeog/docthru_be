-- DropForeignKey
ALTER TABLE "Participate" DROP CONSTRAINT "Participate_challengeId_fkey";

-- AddForeignKey
ALTER TABLE "Participate" ADD CONSTRAINT "Participate_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
