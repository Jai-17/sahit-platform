-- AlterTable
ALTER TABLE "HelpRequest" ADD COLUMN     "ngoResolved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "seekerResolved" BOOLEAN NOT NULL DEFAULT false;
