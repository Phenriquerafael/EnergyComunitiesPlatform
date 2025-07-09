/*
  Warnings:

  - Added the required column `communityId` to the `Simulation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Simulation" ADD COLUMN     "communityId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Simulation" ADD CONSTRAINT "Simulation_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;
