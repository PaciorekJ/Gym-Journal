/*
  Warnings:

  - You are about to drop the column `set` on the `WeightTrainingEntry` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WeightTrainingEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weight" INTEGER NOT NULL,
    "units" TEXT NOT NULL,
    "rep" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    CONSTRAINT "WeightTrainingEntry_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WeightTrainingEntry" ("exerciseId", "id", "rep", "units", "weight") SELECT "exerciseId", "id", "rep", "units", "weight" FROM "WeightTrainingEntry";
DROP TABLE "WeightTrainingEntry";
ALTER TABLE "new_WeightTrainingEntry" RENAME TO "WeightTrainingEntry";
CREATE UNIQUE INDEX "WeightTrainingEntry_exerciseId_key" ON "WeightTrainingEntry"("exerciseId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
