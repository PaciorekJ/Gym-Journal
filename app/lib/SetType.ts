
export const enum ESetType {
    WEIGHT_BASED = "WEIGHT_BASED",
    TIME_BASED = "TIME_BASED",
}

export const SetType = {
    WEIGHT_BASED: "WEIGHT_BASED",
    TIME_BASED: "TIME_BASED",
};

export type SetType = keyof typeof SetType;
