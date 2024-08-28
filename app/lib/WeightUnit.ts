

export const enum EWeightUnit {
    LBS = "lbs",
    KG = "kg",
}

export const WeightUnit = {
    LBS: "lbs",
    KG: "kg",
};

export type WeightUnit = keyof typeof WeightUnit;
