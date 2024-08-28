import { ExerciseEntry, SetEntry } from "@prisma/client";
import { CircleX } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FormatExerciseTime } from "~/lib/Date";
import { cn } from "~/lib/utils";

export default function ExerciseList({
	exercises,
	className,
}: {
	exercises: (ExerciseEntry & { sets: SetEntry[] })[];
	className?: string;
}) {
	return exercises.length > 0 ? (
		<div className={cn("space-y-4", className)}>
			{(exercises as (ExerciseEntry & { sets: SetEntry[] })[]).map(
				(exercise, exerciseIndex) => (
					<Card key={exerciseIndex} className="bg-white shadow-sm">
						<CardHeader>
							<CardTitle>{exercise.exerciseName}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							{exercise.sets.map((set, setIndex) => (
								<div
									key={`${exerciseIndex}-${setIndex}`}
									className="flex flex-col gap-2 p-2 rounded-lg border">
									{set.type === "WEIGHT_BASED" ? (
										<>
											<p>Set {setIndex + 1}</p>
											<p>Reps: {set.reps ? set.reps + " reps" : "N/A"}</p>
											<p>
												Weight:{" "}
												{set.weight ? `${set.weight} ${set.units}` : "N/A"}
											</p>
										</>
									) : set.type === "TIME_BASED" ? (
										<>
											<p>
												Distance:{" "}
												{set.distance
													? `${set.distance} ${set.distanceUnits}`
													: "N/A"}
											</p>
											<p>Duration: {FormatExerciseTime(set) || "N/A"}</p>
										</>
									) : (
										<p>Unknown Set Type</p>
									)}
									<Button
										variant="outline"
										size="sm"
										className="mt-2 flex items-center justify-center">
										<CircleX className="mr-2 h-4 w-4" /> Remove
									</Button>
								</div>
							))}
						</CardContent>
					</Card>
				),
			)}
		</div>
	) : (
		<p className="text-center font-bold">No exercises found for today!</p>
	);
}
