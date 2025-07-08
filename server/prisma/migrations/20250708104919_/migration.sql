-- CreateEnum
CREATE TYPE "HelpType" AS ENUM ('LEGAL', 'SHELTER', 'COUNSELLING', 'FINANCIAL', 'OTHER');

-- CreateEnum
CREATE TYPE "HelpUrgency" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "HelpStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'DECLINED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('NGO', 'HELP_SEEKER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NGO" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "replyTimeMins" INTEGER NOT NULL,
    "supportTypes" "HelpType"[],
    "location" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsappSame" BOOLEAN NOT NULL DEFAULT true,
    "whatsappNumber" TEXT,
    "about" TEXT NOT NULL,
    "representativeName" TEXT NOT NULL,
    "representativeTitle" TEXT NOT NULL,
    "representativeAvailability" TEXT NOT NULL,
    "verifiedDocs" TEXT[],
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "NGO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HelpSeeker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "email" TEXT,
    "company" TEXT,
    "jobType" TEXT,
    "photo" TEXT,
    "occupation" TEXT,
    "whatsappSame" BOOLEAN NOT NULL DEFAULT true,
    "whatsapp" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "alias" TEXT NOT NULL,
    "idProofs" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "HelpSeeker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "ngoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HelpRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "helpType" "HelpType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attachments" TEXT[],
    "hideId" BOOLEAN NOT NULL DEFAULT false,
    "hideFace" BOOLEAN NOT NULL DEFAULT false,
    "hideName" BOOLEAN NOT NULL DEFAULT false,
    "urgency" "HelpUrgency" NOT NULL,
    "status" "HelpStatus" NOT NULL DEFAULT 'PENDING',
    "ngoId" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HelpRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NGO_email_key" ON "NGO"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NGO_userId_key" ON "NGO"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HelpSeeker_userId_key" ON "HelpSeeker"("userId");

-- AddForeignKey
ALTER TABLE "NGO" ADD CONSTRAINT "NGO_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpSeeker" ADD CONSTRAINT "HelpSeeker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "HelpSeeker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpRequest" ADD CONSTRAINT "HelpRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "HelpSeeker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpRequest" ADD CONSTRAINT "HelpRequest_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO"("id") ON DELETE SET NULL ON UPDATE CASCADE;
