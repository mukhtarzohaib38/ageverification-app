/*
  Warnings:

  - You are about to drop the column `createdAt` on the `UserVerification` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `UserVerification` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserVerification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL
);
INSERT INTO "new_UserVerification" ("city", "country", "firstName", "id", "lastName", "streetAddress", "zipCode") SELECT "city", "country", "firstName", "id", "lastName", "streetAddress", "zipCode" FROM "UserVerification";
DROP TABLE "UserVerification";
ALTER TABLE "new_UserVerification" RENAME TO "UserVerification";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
