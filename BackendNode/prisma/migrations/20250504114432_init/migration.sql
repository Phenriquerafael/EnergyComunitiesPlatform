-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roleId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "prosumerId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "intervalOfTime" TEXT NOT NULL,
    "numberOfIntervals" INTEGER NOT NULL,
    "stateOfCharge" TEXT NOT NULL,
    "batteryDischarge" TEXT NOT NULL,
    "batteryCharge" TEXT NOT NULL,
    "photovoltaicEnergyLoad" TEXT NOT NULL,
    "boughtEnergyAmount" TEXT NOT NULL,
    "boughtEnergyPrice" TEXT,
    "soldEnergyAmount" TEXT NOT NULL,
    "soldEnergyPrice" TEXT,
    "peerOutputEnergyLoad" TEXT NOT NULL,
    "peerOutPrice" TEXT,
    "peerInputEnergyLoad" TEXT NOT NULL,
    "peerInPrice" TEXT,
    "profileLoad" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Battery" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "efficiency" TEXT NOT NULL,
    "maxCapacity" TEXT NOT NULL,
    "initialCapacity" TEXT NOT NULL,
    "maxChargeDischarge" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Battery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prosumer" (
    "id" TEXT NOT NULL,
    "batteryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "communityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prosumer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Community" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Prosumer_batteryId_key" ON "Prosumer"("batteryId");

-- CreateIndex
CREATE UNIQUE INDEX "Prosumer_userId_key" ON "Prosumer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Prosumer_communityId_key" ON "Prosumer"("communityId");

-- CreateIndex
CREATE UNIQUE INDEX "Community_name_key" ON "Community"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_prosumerId_fkey" FOREIGN KEY ("prosumerId") REFERENCES "Prosumer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prosumer" ADD CONSTRAINT "Prosumer_batteryId_fkey" FOREIGN KEY ("batteryId") REFERENCES "Battery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prosumer" ADD CONSTRAINT "Prosumer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prosumer" ADD CONSTRAINT "Prosumer_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE SET NULL ON UPDATE CASCADE;
