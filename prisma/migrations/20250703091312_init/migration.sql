-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AgeVerificationConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enabled" BOOLEAN NOT NULL,
    "popupTrigger" TEXT NOT NULL,
    "minimumAge" INTEGER NOT NULL,
    "popupTitle" TEXT,
    "popupDescription" TEXT,
    "buttonText" TEXT,
    "primaryColor" TEXT,
    "logoUrl" TEXT,
    "eSignatureEnabled" BOOLEAN NOT NULL DEFAULT true,
    "idUploadEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailTrigger" TEXT NOT NULL DEFAULT 'after_popup',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AgeVerificationConfig" ("createdAt", "eSignatureEnabled", "emailEnabled", "emailTrigger", "enabled", "id", "idUploadEnabled", "minimumAge", "popupTrigger", "updatedAt") SELECT "createdAt", "eSignatureEnabled", "emailEnabled", "emailTrigger", "enabled", "id", "idUploadEnabled", "minimumAge", "popupTrigger", "updatedAt" FROM "AgeVerificationConfig";
DROP TABLE "AgeVerificationConfig";
ALTER TABLE "new_AgeVerificationConfig" RENAME TO "AgeVerificationConfig";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
