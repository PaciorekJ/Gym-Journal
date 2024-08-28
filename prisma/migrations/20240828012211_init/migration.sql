/*
  Warnings:

  - You are about to drop the `CardioEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WeightTrainingEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `type` on the `ExerciseEntry` table. All the data in the column will be lost.
  - Made the column `workoutId` on table `ExerciseEntry` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "CardioEntry_exerciseId_key";

-- DropIndex
DROP INDEX "WeightTrainingEntry_exerciseId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CardioEntry";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WeightTrainingEntry";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "SetEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "reps" INTEGER,
    "weight" INTEGER,
    "units" TEXT,
    "hours" INTEGER,
    "minutes" INTEGER,
    "seconds" INTEGER,
    "distance" INTEGER,
    "distanceUnits" TEXT,
    "exerciseId" INTEGER NOT NULL,
    CONSTRAINT "SetEntry_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "ExerciseEntry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExerciseEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exerciseName" TEXT NOT NULL,
    "workoutId" INTEGER NOT NULL,
    CONSTRAINT "ExerciseEntry_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "WorkoutEntry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ExerciseEntry" ("exerciseName", "id", "workoutId") SELECT "exerciseName", "id", "workoutId" FROM "ExerciseEntry";
DROP TABLE "ExerciseEntry";
ALTER TABLE "new_ExerciseEntry" RENAME TO "ExerciseEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
