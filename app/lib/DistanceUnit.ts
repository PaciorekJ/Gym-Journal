
export const enum EDistanceUnit {
    MILES = "mi",
    KILOMETERS = "km",
    METERS = "m",
}

export const DistanceUnit = {
    MILES: "mi",
    KILOMETERS: "km",
    METERS: "m",
};

export type WeightUnit = keyof typeof DistanceUnit;
