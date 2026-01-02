/*
  Warnings:

  - Added the required column `filename` to the `LessonResource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `LessonResource` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LessonResource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LessonResource_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LessonResource" ("createdAt", "fileId", "id", "lessonId") SELECT "createdAt", "fileId", "id", "lessonId" FROM "LessonResource";
DROP TABLE "LessonResource";
ALTER TABLE "new_LessonResource" RENAME TO "LessonResource";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
