/*
  Warnings:

  - You are about to drop the column `isVerified` on the `HelpSeeker` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `NGO` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HelpSeeker" DROP COLUMN "isVerified";

-- AlterTable
ALTER TABLE "NGO" DROP COLUMN "isVerified";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
