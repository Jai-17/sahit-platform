-- CreateEnum
CREATE TYPE "NGOHelpStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateTable
CREATE TABLE "HelpRequestNGOStatus" (
    "id" TEXT NOT NULL,
    "helpRequestId" TEXT NOT NULL,
    "ngoId" TEXT NOT NULL,
    "status" "NGOHelpStatus" NOT NULL DEFAULT 'PENDING',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HelpRequestNGOStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HelpRequestNGOStatus" ADD CONSTRAINT "HelpRequestNGOStatus_helpRequestId_fkey" FOREIGN KEY ("helpRequestId") REFERENCES "HelpRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpRequestNGOStatus" ADD CONSTRAINT "HelpRequestNGOStatus_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
