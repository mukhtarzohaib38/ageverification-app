/*
  Warnings:

  - You are about to drop the `CustomerVerification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CustomerVerification";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "AgeVerificationConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "popupTrigger" TEXT NOT NULL DEFAULT 'checkout',
    "minimumAge" INTEGER NOT NULL DEFAULT 18,
    "eSignatureEnabled" BOOLEAN NOT NULL DEFAULT true,
    "idUploadEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailTrigger" TEXT NOT NULL DEFAULT 'after_popup',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customer" TEXT NOT NULL,
    "orderDetails" TEXT NOT NULL,
    "verificationId" TEXT NOT NULL,
    "ageSubmitted" INTEGER NOT NULL,
    "idType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "verificationDate" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Verification_verificationId_key" ON "Verification"("verificationId");
