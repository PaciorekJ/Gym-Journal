/*
  Warnings:

  - Added the required column `userId` to the `WorkoutEntry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WorkoutEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "WorkoutEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WorkoutEntry" ("date", "id") SELECT "date", "id" FROM "WorkoutEntry";
DROP TABLE "WorkoutEntry";
ALTER TABLE "new_WorkoutEntry" RENAME TO "WorkoutEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
