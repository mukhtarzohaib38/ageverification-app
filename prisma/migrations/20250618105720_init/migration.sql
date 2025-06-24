-- CreateTable
CREATE TABLE "CustomerVerification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerName" TEXT NOT NULL,
    "orderDetails" TEXT NOT NULL,
    "verificationId" TEXT NOT NULL,
    "ageSubmitted" INTEGER NOT NULL,
    "idType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "verificationDate" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerVerification_verificationId_key" ON "CustomerVerification"("verificationId");
