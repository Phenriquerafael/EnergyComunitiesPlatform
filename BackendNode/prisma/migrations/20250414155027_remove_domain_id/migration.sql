/*
  Warnings:

  - You are about to drop the column `domainId` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `domainId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Role_domainId_key";

-- DropIndex
DROP INDEX "User_domainId_key";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "domainId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "domainId";

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "timeStampUnit" TEXT NOT NULL,
    "timeStampIntervalNumber" INTEGER NOT NULL,
    "stateOfCharge" TEXT NOT NULL,
    "photovoltaicEnergyLoad" TEXT NOT NULL,
    "boughtEnergyAmount" TEXT NOT NULL,
    "boughtEnergyPrice" TEXT NOT NULL,
    "soldEnergyAmount" TEXT NOT NULL,
    "soldEnergyPrice" TEXT NOT NULL,
    "profileLoad" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Battery" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "efficiency" TEXT NOT NULL,
    "maxCapacity" TEXT NOT NULL,
    "maxCharge" TEXT NOT NULL,
    "maxDischarge" TEXT NOT NULL,
    "stateOfCharge" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Battery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prosumer" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "batteryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prosumer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Battery_profileId_key" ON "Battery"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Prosumer_profileId_key" ON "Prosumer"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Prosumer_batteryId_key" ON "Prosumer"("batteryId");

-- CreateIndex
CREATE UNIQUE INDEX "Prosumer_userId_key" ON "Prosumer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_roleId_key" ON "User"("roleId");

-- AddForeignKey
ALTER TABLE "Prosumer" ADD CONSTRAINT "Prosumer_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prosumer" ADD CONSTRAINT "Prosumer_batteryId_fkey" FOREIGN KEY ("batteryId") REFERENCES "Battery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prosumer" ADD CONSTRAINT "Prosumer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
