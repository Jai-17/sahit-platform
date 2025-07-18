/*
  Warnings:

  - A unique constraint covering the columns `[helpRequestId,ngoId]` on the table `HelpRequestNGOStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HelpRequestNGOStatus_helpRequestId_ngoId_key" ON "HelpRequestNGOStatus"("helpRequestId", "ngoId");
