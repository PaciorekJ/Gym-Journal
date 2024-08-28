import { SetEntry } from "@prisma/client";

export const TODAY_BEGINNING = new Date(
    Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
    ),
);

export const TODAY_END = new Date(TODAY_BEGINNING.getTime() + 86400000 - 1);

export const FormatExerciseTime = (set: SetEntry) => {
	if (!set.hours && !set.minutes && !set.seconds) {
		return null;
	}

	const { hours, minutes, seconds } = set;

	return `${hours || 0}h ${minutes || 0}m ${seconds || 0}s`;
};

export const getEndOfDay = (date: Date) => {
    return new Date(date.getTime() + 86400000)
}