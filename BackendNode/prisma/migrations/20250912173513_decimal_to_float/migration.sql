/*
  Warnings:

  - You are about to alter the column `efficiency` on the `Battery` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `maxCapacity` on the `Battery` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `initialCapacity` on the `Battery` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `maxChargeDischarge` on the `Battery` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `stateOfCharge` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `batteryDischarge` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `batteryCharge` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `photovoltaicEnergyLoad` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `boughtEnergyAmount` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `boughtEnergyPrice` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `soldEnergyAmount` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `soldEnergyPrice` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `peerOutputEnergyLoad` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `peerOutPrice` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `peerInputEnergyLoad` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `peerInPrice` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `profileLoad` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "public"."Battery" ALTER COLUMN "efficiency" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "maxCapacity" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "initialCapacity" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "maxChargeDischarge" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Profile" ALTER COLUMN "stateOfCharge" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "batteryDischarge" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "batteryCharge" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "photovoltaicEnergyLoad" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "boughtEnergyAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "boughtEnergyPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "soldEnergyAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "soldEnergyPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "peerOutputEnergyLoad" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "peerOutPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "peerInputEnergyLoad" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "peerInPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "profileLoad" SET DATA TYPE DOUBLE PRECISION;
