/*
  Warnings:

  - You are about to drop the `Workout` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Workout";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "WorkoutEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExerciseEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exerciseName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "workoutId" INTEGER,
    CONSTRAINT "ExerciseEntry_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "WorkoutEntry" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ExerciseEntry" ("exerciseName", "id", "type", "workoutId") SELECT "exerciseName", "id", "type", "workoutId" FROM "ExerciseEntry";
DROP TABLE "ExerciseEntry";
ALTER TABLE "new_ExerciseEntry" RENAME TO "ExerciseEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
