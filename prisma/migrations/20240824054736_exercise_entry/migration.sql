/*
  Warnings:

  - You are about to drop the `Exercise` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Exercise";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ExerciseEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exerciseName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "workoutId" INTEGER,
    CONSTRAINT "ExerciseEntry_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

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
    CONSTRAINT "CardioEntry_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "ExerciseEntry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CardioEntry" ("distance", "exerciseId", "hours", "id", "minutes", "seconds", "units") SELECT "distance", "exerciseId", "hours", "id", "minutes", "seconds", "units" FROM "CardioEntry";
DROP TABLE "CardioEntry";
ALTER TABLE "new_CardioEntry" RENAME TO "CardioEntry";
CREATE UNIQUE INDEX "CardioEntry_exerciseId_key" ON "CardioEntry"("exerciseId");
CREATE TABLE "new_WeightTrainingEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rep" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "units" TEXT NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    CONSTRAINT "WeightTrainingEntry_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "ExerciseEntry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WeightTrainingEntry" ("exerciseId", "id", "rep", "units", "weight") SELECT "exerciseId", "id", "rep", "units", "weight" FROM "WeightTrainingEntry";
DROP TABLE "WeightTrainingEntry";
ALTER TABLE "new_WeightTrainingEntry" RENAME TO "WeightTrainingEntry";
CREATE UNIQUE INDEX "WeightTrainingEntry_exerciseId_key" ON "WeightTrainingEntry"("exerciseId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
