-- CreateTable
CREATE TABLE "public"."Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
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
CREATE TABLE "public"."Profile" (
    "id" TEXT NOT NULL,
    "prosumerId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "intervalOfTime" TEXT NOT NULL,
    "numberOfIntervals" INTEGER NOT NULL,
    "stateOfCharge" DECIMAL(65,30) NOT NULL,
    "batteryDischarge" DECIMAL(65,30) NOT NULL,
    "batteryCharge" DECIMAL(65,30) NOT NULL,
    "photovoltaicEnergyLoad" DECIMAL(65,30) NOT NULL,
    "boughtEnergyAmount" DECIMAL(65,30) NOT NULL,
    "boughtEnergyPrice" DECIMAL(65,30),
    "soldEnergyAmount" DECIMAL(65,30) NOT NULL,
    "soldEnergyPrice" DECIMAL(65,30),
    "peerOutputEnergyLoad" DECIMAL(65,30) NOT NULL,
    "peerOutPrice" DECIMAL(65,30),
    "peerInputEnergyLoad" DECIMAL(65,30) NOT NULL,
    "peerInPrice" DECIMAL(65,30),
    "profileLoad" DECIMAL(65,30),
    "simulationId" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Simulation" (
    "id" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "description" TEXT,
    "communityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Simulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ActiveAttributes" (
    "simulationId" TEXT NOT NULL,
    "prosumerId" TEXT NOT NULL,
    "profileLoad" BOOLEAN NOT NULL DEFAULT false,
    "stateOfCharge" BOOLEAN NOT NULL DEFAULT false,
    "photovoltaicEnergyLoad" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ActiveAttributes_pkey" PRIMARY KEY ("simulationId","prosumerId")
);

-- CreateTable
CREATE TABLE "public"."Battery" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "efficiency" DECIMAL(65,30) NOT NULL,
    "maxCapacity" DECIMAL(65,30) NOT NULL,
    "initialCapacity" DECIMAL(65,30) NOT NULL,
    "maxChargeDischarge" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Battery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Prosumer" (
    "id" TEXT NOT NULL,
    "batteryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "communityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prosumer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Community" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "country" TEXT,
    "countryCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CommunityManager" (
    "id" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityManager_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "public"."Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Prosumer_userId_key" ON "public"."Prosumer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Community_name_key" ON "public"."Community"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityManager_communityId_key" ON "public"."CommunityManager"("communityId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityManager_userId_key" ON "public"."CommunityManager"("userId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_prosumerId_fkey" FOREIGN KEY ("prosumerId") REFERENCES "public"."Prosumer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "public"."Simulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Simulation" ADD CONSTRAINT "Simulation_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "public"."Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActiveAttributes" ADD CONSTRAINT "ActiveAttributes_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "public"."Simulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prosumer" ADD CONSTRAINT "Prosumer_batteryId_fkey" FOREIGN KEY ("batteryId") REFERENCES "public"."Battery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prosumer" ADD CONSTRAINT "Prosumer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prosumer" ADD CONSTRAINT "Prosumer_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "public"."Community"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommunityManager" ADD CONSTRAINT "CommunityManager_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "public"."Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommunityManager" ADD CONSTRAINT "CommunityManager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
