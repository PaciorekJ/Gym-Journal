-- CreateTable
CREATE TABLE "Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exerciseName" TEXT NOT NULL,
    "hours" INTEGER NOT NULL,
    "minutes" INTEGER NOT NULL,
    "seconds" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "workoutId" INTEGER,
    CONSTRAINT "Exercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeightTraining" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weight" INTEGER NOT NULL,
    "rep" INTEGER NOT NULL,
    "set" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    CONSTRAINT "WeightTraining_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "WeightTraining_exerciseId_key" ON "WeightTraining"("exerciseId");
