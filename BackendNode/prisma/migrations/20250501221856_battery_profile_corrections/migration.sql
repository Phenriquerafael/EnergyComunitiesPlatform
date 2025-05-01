/*
  Warnings:

  - Added the required column `initialCapacity` to the `Battery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `batteryCharge` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `batteryDischarge` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `peerInputEnergyLoad` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `peerOutputEnergyLoad` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Battery" ADD COLUMN     "initialCapacity" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "batteryCharge" TEXT NOT NULL,
ADD COLUMN     "batteryDischarge" TEXT NOT NULL,
ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "peerInPrice" TEXT,
ADD COLUMN     "peerInputEnergyLoad" TEXT NOT NULL,
ADD COLUMN     "peerOutPrice" TEXT,
ADD COLUMN     "peerOutputEnergyLoad" TEXT NOT NULL,
ALTER COLUMN "boughtEnergyPrice" DROP NOT NULL,
ALTER COLUMN "soldEnergyPrice" DROP NOT NULL;
