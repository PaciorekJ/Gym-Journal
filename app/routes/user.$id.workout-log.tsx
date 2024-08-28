import { ExerciseEntry, SetEntry, WorkoutEntry } from "@prisma/client";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
	json,
	useLoaderData,
	useNavigate,
	useSearchParams,
} from "@remix-run/react";
import { SelectSingleEventHandler } from "react-day-picker";
import ExercisesList from "~/components/ExercisesList";
import { Calendar } from "~/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import prisma from "~/database.server";
import { getEndOfDay, TODAY_BEGINNING } from "~/lib/Date";

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = parseInt(params.id || "", 10);
	if (!userId) {
		throw new Response("User Not Found", { status: 404 });
	}

	const url = new URL(request.url);
	const selectedDate = url.searchParams.get("date");

	let workouts: (WorkoutEntry & {
		exercises: (ExerciseEntry & { sets: SetEntry[] })[];
	})[] = [];

	const date: Date = selectedDate ? new Date(selectedDate) : TODAY_BEGINNING;

	workouts = await prisma.workoutEntry.findMany({
		where: {
			date: {
				gte: date,
				lt: getEndOfDay(date),
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

	return json({ userId, workouts });
}

export default function UserWorkoutLogs() {
	const { workouts } = useLoaderData<typeof loader>() || { workouts: [] };
	const [searchParams] = useSearchParams();
	const date = searchParams.get("date")
		? new Date(searchParams.get("date") || "")
		: new Date();
	const navigate = useNavigate();

	const handleDateSelect = (selectedDate: Date) => {
		navigate(`?date=${selectedDate.toISOString()}`);
		return;
	};

	return (
		<div className="flex flex-col items-center gap-10">
			<Calendar
				mode="single"
				selected={date}
				onSelect={handleDateSelect as SelectSingleEventHandler}
				className="rounded-md border bg-white"
			/>
			{/* Display Workout Entry Table if Available */}
			{workouts.length > 0 && (
				<Card className="w-full max-w-4xl mb-4 bg-white">
					<CardHeader>
						<CardTitle>Workout on {date.toLocaleDateString()}</CardTitle>
					</CardHeader>
					<CardContent>
						<ExercisesList className="max-h-[60vh] overflow-y-auto" exercises={workouts[0].exercises} />
					</CardContent>
				</Card>
			)}
		</div>
	);
}
