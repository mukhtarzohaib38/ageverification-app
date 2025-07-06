/*
  Warnings:

  - You are about to drop the column `createdAt` on the `EmailTemplateSetting` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `EmailTemplateSetting` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmailTemplateSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "subject" TEXT,
    "preview" TEXT,
    "body" TEXT,
    "note" TEXT,
    "description" TEXT,
    "instructions" TEXT,
    "privacyNote" TEXT,
    "maxFileSize" TEXT
);
INSERT INTO "new_EmailTemplateSetting" ("body", "description", "id", "instructions", "maxFileSize", "note", "preview", "privacyNote", "subject", "type") SELECT "body", "description", "id", "instructions", "maxFileSize", "note", "preview", "privacyNote", "subject", "type" FROM "EmailTemplateSetting";
DROP TABLE "EmailTemplateSetting";
ALTER TABLE "new_EmailTemplateSetting" RENAME TO "EmailTemplateSetting";
CREATE UNIQUE INDEX "EmailTemplateSetting_type_key" ON "EmailTemplateSetting"("type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
