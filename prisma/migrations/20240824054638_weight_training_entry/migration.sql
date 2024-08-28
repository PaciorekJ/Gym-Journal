/*
  Warnings:

  - You are about to drop the column `hours` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `minutes` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `seconds` on the `Exercise` table. All the data in the column will be lost.
  - Added the required column `hours` to the `CardioEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minutes` to the `CardioEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seconds` to the `CardioEntry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CardioEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hours" INTEGER NOT NULL,
    "minutes" INTEGER NOT NULL,
    "seconds" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,
    "units" TEXT NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    CONSTRAINT "CardioEntry_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CardioEntry" ("distance", "exerciseId", "id", "units") SELECT "distance", "exerciseId", "id", "units" FROM "CardioEntry";
DROP TABLE "CardioEntry";
ALTER TABLE "new_CardioEntry" RENAME TO "CardioEntry";
CREATE UNIQUE INDEX "CardioEntry_exerciseId_key" ON "CardioEntry"("exerciseId");
CREATE TABLE "new_Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exerciseName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "workoutId" INTEGER,
    CONSTRAINT "Exercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Exercise" ("exerciseName", "id", "type", "workoutId") SELECT "exerciseName", "id", "type", "workoutId" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
