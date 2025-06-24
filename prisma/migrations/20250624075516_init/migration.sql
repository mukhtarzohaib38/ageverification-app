-- CreateTable
CREATE TABLE "EmailTemplateSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "subject" TEXT,
    "preview" TEXT,
    "body" TEXT,
    "note" TEXT,
    "description" TEXT,
    "instructions" TEXT,
    "privacyNote" TEXT,
    "maxFileSize" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
