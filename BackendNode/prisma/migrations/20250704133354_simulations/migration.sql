-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "simulationId" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "Simulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
