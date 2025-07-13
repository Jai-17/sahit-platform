/*
  Warnings:

  - You are about to drop the column `location` on the `HelpSeeker` table. All the data in the column will be lost.
  - Added the required column `address` to the `HelpSeeker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `HelpSeeker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `HelpSeeker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HelpSeeker" DROP COLUMN "location",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ALTER COLUMN "idProofs" SET NOT NULL,
ALTER COLUMN "idProofs" SET DATA TYPE TEXT;
