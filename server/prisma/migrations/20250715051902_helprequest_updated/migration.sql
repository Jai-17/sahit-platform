/*
  Warnings:

  - The values [DECLINED] on the enum `HelpStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "HelpStatus_new" AS ENUM ('PENDING', 'SEND_TO_NGOS', 'ACCEPTED_BY_NGO', 'DECLINED_BY_ALL', 'IN_PROGRESS', 'RESOLVED', 'DECLINED_BY_NGO', 'CANCELLED_BY_USER');
ALTER TABLE "HelpRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "HelpRequest" ALTER COLUMN "status" TYPE "HelpStatus_new" USING ("status"::text::"HelpStatus_new");
ALTER TYPE "HelpStatus" RENAME TO "HelpStatus_old";
ALTER TYPE "HelpStatus_new" RENAME TO "HelpStatus";
DROP TYPE "HelpStatus_old";
ALTER TABLE "HelpRequest" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- CreateTable
CREATE TABLE "_RequestedNGOs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RequestedNGOs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RequestedNGOs_B_index" ON "_RequestedNGOs"("B");

-- AddForeignKey
ALTER TABLE "_RequestedNGOs" ADD CONSTRAINT "_RequestedNGOs_A_fkey" FOREIGN KEY ("A") REFERENCES "HelpRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RequestedNGOs" ADD CONSTRAINT "_RequestedNGOs_B_fkey" FOREIGN KEY ("B") REFERENCES "NGO"("id") ON DELETE CASCADE ON UPDATE CASCADE;
