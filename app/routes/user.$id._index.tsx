/* eslint-disable no-mixed-spaces-and-tabs */
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect, useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { ZodError } from "zod";
import ExercisesList from "~/components/ExercisesList";
import { TimeComboBox } from "~/components/TimeComboBox";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import prisma from "~/database.server";
import { TODAY_BEGINNING, TODAY_END } from "~/lib/Date";
import { DistanceUnit } from "~/lib/DistanceUnit";
import { SetType } from "~/lib/SetType";
import Validator, { IExercise } from "~/lib/validation";
import { WeightUnit } from "~/lib/WeightUnit";

export async function loader({ params }: LoaderFunctionArgs) {
	const userId = parseInt(params.id || "", 10);
	if (!userId) {
		throw new Response("User Not Found", { status: 404 });
	}

	const todaysWorkout = await prisma.workoutEntry.findFirst({
		where: {
			userId: userId,
			date: {
				gte: TODAY_BEGINNING,
				lt: TODAY_END,
			},
		},
		include: {
			exercises: {
				include: {
					sets: true,
				},
			},
		},
	});

	return json({
		workout: todaysWorkout || null,
	});
}

export async function action({ request, params }: ActionFunctionArgs) {
	const formData = await request.formData();
	const userId = parseInt(params.id || "", 10) || null;

	if (!userId || isNaN(userId)) {
		throw new Response("Invalid user ID", { status: 400 });
	}

	const exerciseData = {
		exerciseName: formData.get("exerciseName")?.toString() || "",
		sets: [
			{
				reps: parseInt(formData.get("reps")?.toString() || "", 10) || null,
				weight: parseInt(formData.get("weight")?.toString() || "", 10) || null,
				units: formData.get("units")?.toString() || null,
				hours: parseInt(formData.get("hours")?.toString() || "", 10) || null,
				minutes:
					parseInt(formData.get("minutes")?.toString() || "", 10) || null,
				seconds:
					parseInt(formData.get("seconds")?.toString() || "", 10) || null,
				distance:
					parseInt(formData.get("distance")?.toString() || "", 10) || null,
				distanceUnits: formData.get("distanceUnits")?.toString() || null,
				type: (formData.get("type")?.toString() as SetType) || "N/A",
			},
		],
	};

	exerciseData.sets[0].weight = null;

	try {
		Validator.exercises.parse(exerciseData);
	} catch (error) {
		const zodError = error as ZodError<IExercise>;
		return json({ error: zodError.errors[0].message });
	}

	let workout = await prisma.workoutEntry.findFirst({
		where: {
			userId: userId,
			date: {
				gte: TODAY_BEGINNING,
				lt: TODAY_END,
			},
		},
	});

	if (!workout) {
		workout = await prisma.workoutEntry.create({
			data: {
				userId,
				date: TODAY_BEGINNING,
			},
		});
	}

	let exercise = await prisma.exerciseEntry.findFirst({
		where: {
			workoutId: workout.id,
			exerciseName: exerciseData.exerciseName,
		},
	});

	if (!exercise) {
		exercise = await prisma.exerciseEntry.create({
			data: {
				exerciseName: exerciseData.exerciseName,
				workoutId: workout.id,
			},
		});
	}

	await prisma.setEntry.create({
		data: {
			...exerciseData.sets[0],
			exerciseId: exercise.id,
		},
	});

	return redirect(`?workoutId=${workout.id}`);
}

export default function UserPage() {
	const { workout } = useLoaderData<typeof loader>();
	const actionData = useActionData<typeof action>();
	const [weightUnits, setWeightUnits] = useState("lbs");
	const [cardioUnits, setCardioUnits] = useState("mi");
	const exercises = workout?.exercises || [];

	return (
		<div>
			<p className="h-10 bg-gold text-red-400">
				{(actionData && actionData.error) || "No Error Yet"}
			</p>
			<Card>
				<CardHeader>
					<CardTitle className="text-4xl font-bold font-edu-vic">
						Journal your workouts for today
					</CardTitle>
					<CardDescription>
						Add sets to your workout journal for today
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-10">
						<Tabs defaultValue="weight-training" className="h-[800px]">
							<TabsList className="w-full flex flex-row justify-between">
								<TabsTrigger className="w-full" value="weight-training">
									Weight Training
								</TabsTrigger>
								<TabsTrigger className="w-full" value="cardio">
									Cardio
								</TabsTrigger>
							</TabsList>
							<TabsContent value="weight-training">
								<Form method="post">
									<input
										type="hidden"
										name="type"
										value={SetType.WEIGHT_BASED}
									/>
									<Card className="min-h-[280px] min-w-[370px]">
										<CardHeader>
											<CardTitle>Weight Training</CardTitle>
											<CardDescription>
												Add your weight training set
											</CardDescription>
										</CardHeader>
										<CardContent className="flex flex-col gap-2">
											<Input
												name="exerciseName"
												placeholder="Exercise Name"
												required
											/>
											<Input
												name="reps"
												type="number"
												placeholder="Rep(s)"
												required
											/>
											<div className="flex gap-2">
												<Input
													name="weight"
													type="number"
													placeholder="Weight/Resistance"
													required
												/>
												<ToggleGroup
													defaultValue={weightUnits}
													onValueChange={setWeightUnits}
													type="single">
													<input
														type="hidden"
														name="units"
														value={weightUnits}
													/>
													<ToggleGroupItem
														value={WeightUnit.KG}
														aria-label="Click for Kilograms">
														Kg
													</ToggleGroupItem>
													<ToggleGroupItem
														value={WeightUnit.LBS}
														aria-label="Click for Pounds">
														lbs
													</ToggleGroupItem>
												</ToggleGroup>
											</div>
										</CardContent>
									</Card>
									<div className="flex flex-col gap-2 my-4">
										<Button>Add Set</Button>
									</div>
								</Form>
							</TabsContent>
							<TabsContent value="cardio">
								<Form method="post">
									<input type="hidden" name="type" value={SetType.TIME_BASED} />
									<Card className="min-h-[280px] min-w-[370px]">
										<CardHeader>
											<CardTitle>Cardio</CardTitle>
											<CardDescription>
												Add your cardio exercise
											</CardDescription>
										</CardHeader>
										<CardContent className="flex flex-col gap-2">
											<Input name="exerciseName" placeholder="Exercise Name" />
											<div className="flex gap-2">
												<Input
													name="distance"
													type="number"
													placeholder="Distance Traveled"
												/>
												<ToggleGroup
													defaultValue={cardioUnits}
													onValueChange={setCardioUnits}
													type="single">
													<input
														type="hidden"
														name="distanceUnits"
														value={cardioUnits}
													/>
													<ToggleGroupItem
														value={DistanceUnit.MILES}
														aria-label="Click for Miles">
														Miles
													</ToggleGroupItem>
													<ToggleGroupItem
														value={DistanceUnit.KILOMETERS}
														aria-label="Click for Kilometers">
														Kilometers
													</ToggleGroupItem>
													<ToggleGroupItem
														value={DistanceUnit.METERS}
														aria-label="Click for Meters">
														Meters
													</ToggleGroupItem>
												</ToggleGroup>
											</div>
											<div className="flex gap-2 justify-center">
												<TimeComboBox placeholder="Hours" slug="hours" />
												<TimeComboBox placeholder="Minutes" slug="minutes" />
												<TimeComboBox placeholder="Seconds" slug="seconds" />
											</div>
										</CardContent>
									</Card>
									<div className="flex flex-col gap-2 my-4">
										<Button>Add Set</Button>
									</div>
								</Form>
							</TabsContent>
						</Tabs>
						<ExercisesList exercises={exercises} />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
