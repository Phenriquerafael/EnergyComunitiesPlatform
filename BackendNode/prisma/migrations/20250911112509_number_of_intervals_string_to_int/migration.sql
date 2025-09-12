/*
  Warnings:

  - Changed the type of `intervalOfTime` on the `Profile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Profile" DROP COLUMN "intervalOfTime",
ADD COLUMN     "intervalOfTime" INTEGER NOT NULL;
