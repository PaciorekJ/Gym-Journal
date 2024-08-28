/*
  Warnings:

  - You are about to drop the `WeightTraining` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WeightTraining";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CardioEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "distance" INTEGER NOT NULL,
    "units" TEXT NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    CONSTRAINT "CardioEntry_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeightTrainingEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weight" INTEGER NOT NULL,
    "units" TEXT NOT NULL,
    "rep" INTEGER NOT NULL,
    "set" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    CONSTRAINT "WeightTrainingEntry_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CardioEntry_exerciseId_key" ON "CardioEntry"("exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "WeightTrainingEntry_exerciseId_key" ON "WeightTrainingEntry"("exerciseId");
