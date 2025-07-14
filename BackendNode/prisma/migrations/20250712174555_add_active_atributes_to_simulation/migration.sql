/*
  Warnings:

  - You are about to drop the column `photovoltaicEnergyLoad` on the `Simulation` table. All the data in the column will be lost.
  - You are about to drop the column `profileLoad` on the `Simulation` table. All the data in the column will be lost.
  - You are about to drop the column `stateOfCharge` on the `Simulation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Simulation" DROP COLUMN "photovoltaicEnergyLoad",
DROP COLUMN "profileLoad",
DROP COLUMN "stateOfCharge";

-- CreateTable
CREATE TABLE "ActiveAttributes" (
    "simulationId" TEXT NOT NULL,
    "prosumerId" TEXT NOT NULL,
    "profileLoad" BOOLEAN NOT NULL DEFAULT false,
    "stateOfCharge" BOOLEAN NOT NULL DEFAULT false,
    "photovoltaicEnergyLoad" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ActiveAttributes_pkey" PRIMARY KEY ("simulationId","prosumerId")
);

-- AddForeignKey
ALTER TABLE "ActiveAttributes" ADD CONSTRAINT "ActiveAttributes_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "Simulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
