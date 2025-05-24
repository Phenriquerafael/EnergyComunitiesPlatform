-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "CommunityManager" (
    "id" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityManager_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommunityManager_communityId_key" ON "CommunityManager"("communityId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityManager_userId_key" ON "CommunityManager"("userId");

-- AddForeignKey
ALTER TABLE "CommunityManager" ADD CONSTRAINT "CommunityManager_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityManager" ADD CONSTRAINT "CommunityManager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
