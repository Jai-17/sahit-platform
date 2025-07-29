-- CreateEnum
CREATE TYPE "AwardStatus" AS ENUM ('PENDING', 'STAGE_1_APPROVED', 'STAGE_2_APPROVED', 'NOMINATED', 'DECLINED');

-- CreateTable
CREATE TABLE "Awards" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "workDone" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "AwardStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Awards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Awards_userId_key" ON "Awards"("userId");

-- AddForeignKey
ALTER TABLE "Awards" ADD CONSTRAINT "Awards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
