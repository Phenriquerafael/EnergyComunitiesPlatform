-- DropForeignKey
ALTER TABLE "Prosumer" DROP CONSTRAINT "Prosumer_batteryId_fkey";

-- DropIndex
DROP INDEX "Prosumer_batteryId_key";

-- AddForeignKey
ALTER TABLE "Prosumer" ADD CONSTRAINT "Prosumer_batteryId_fkey" FOREIGN KEY ("batteryId") REFERENCES "Battery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
