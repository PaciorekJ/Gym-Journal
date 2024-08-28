import { z } from "zod";
import { EDistanceUnit } from "./DistanceUnit";
import { ESetType } from "./SetType";
import { EWeightUnit } from "./WeightUnit";

// Base schema for a set
const BaseSetSchema = z.object({
  type: z.enum([ESetType.WEIGHT_BASED, ESetType.TIME_BASED]),
  
  reps: z.number().optional(),
  weight: z.number().optional(),
  units: z.enum([EWeightUnit.KG, EWeightUnit.LBS]).optional(),
  
  hours: z.number().optional(),
  minutes: z.number().optional(),
  seconds: z.number().optional(),
  distance: z.number().optional(),
  distanceUnits: z.enum([EDistanceUnit.KILOMETERS, EDistanceUnit.METERS, EDistanceUnit.MILES]).optional(),
});

// Refine the schema to enforce the requirement for duration or distance
const SetSchema = BaseSetSchema.refine((data) => {
  if (data.type === ESetType.TIME_BASED) {
    // Check if a valid duration or valid distance is provided
    const hasValidDuration =
      data.hours !== undefined || data.minutes !== undefined || data.seconds !== undefined;
    const hasValidDistance =
      data.distance !== undefined && data.distanceUnits !== undefined;

    return hasValidDuration || hasValidDistance;
  }
  return true;
}, {
  message: "You must provide either a duration (hours, minutes, seconds) or a distance for time-based sets.",
  path: ["type"], // Applies to the "type" field in the object
});

const ExerciseSchema = z.object({
  exerciseName: z.string().min(1, "Exercise name is required"),
  sets: z.array(SetSchema),
});

const Validator = {
  userCredentials: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email("Invalid email"),
  }),
  exercises: ExerciseSchema,
};

// Inferred TypeScript Interfaces
export type IUserCredentials = z.infer<typeof Validator.userCredentials>;
export type IExercise = z.infer<typeof Validator.exercises>;
export type ISet = z.infer<typeof SetSchema>;

export default Validator;
