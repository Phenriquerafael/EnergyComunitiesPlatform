-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_prosumerId_fkey";

-- DropIndex
DROP INDEX "Profile_prosumerId_key";

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_prosumerId_fkey" FOREIGN KEY ("prosumerId") REFERENCES "Prosumer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
