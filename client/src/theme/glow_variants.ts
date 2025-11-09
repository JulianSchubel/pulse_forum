export enum GlowVariant {
    DEFAULT="default",
    RAINBOW="rainbow",
    SUCCESS="success",
    ERROR="error",
    INFO="info",
    WARNING="warning",
}

export const glowBase = {
    position: "relative",
    borderRadius: "12px",
    margin: "0.2rem",
    transition: "all 0.3s ease-in-out",
    "&::before, &::after": {
        content: '""',
        position: "absolute",
        inset: "-0.15rem",
        zIndex: -1,
        borderRadius: "inherit",
        filter: "blur(0.1rem)",
        animation: "rotation 10s linear infinite",
    },
    "@keyframes rotation": {
        "0%": { "--gradient-angle": "0deg" },
        "100%": { "--gradient-angle": "360deg" },
    },
} as const;

export const glowVariants: Record<GlowVariant, any> = {
    default: {
        ...glowBase,
        background: "linear-gradient(180deg, var(--green-1), var(--green-3))",
        border: "1px solid var(--green-4)",
        color: "var(--green-7)",
        "&::before, &::after": {
            ...glowBase["&::before, &::after"],
            background:
                "conic-gradient(from var(--gradient-angle), var(--purple-1), var(--green-7), var(--yellow-5), var(--green-7), var(--purple-1))",
        },
    },
    rainbow: {
        ...glowBase,
        background: "linear-gradient(180deg, var(--green-1), var(--green-3))",
        border: "1px solid var(--green-4)",
        color: "var(--green-7)",
        "&::before, &::after": {
            ...glowBase["&::before, &::after"],
            background:
                "conic-gradient(from var(--gradient-angle), var(--purple-1), var(--green-7), var(--yellow-5), var(--green-7), var(--purple-1))",
        },
    },
    success: {
        ...glowBase,
        background: "linear-gradient(180deg, var(--green-2), var(--green-4))",
        border: "1px solid var(--green-5)",
        color: "var(--green-7)",
        "&::before, &::after": {
            ...glowBase["&::before, &::after"],
            background:
                "conic-gradient(from var(--gradient-angle), var(--green-1), var(--green-4), var(--green-7), var(--green-5), var(--green-1))",
        },
    },
    error: {
        ...glowBase,
        background: "linear-gradient(180deg, var(--red-2), var(--red-3))",
        border: "1px solid var(--red-1)",
        color: "var(--red-5)",
        "&::before, &::after": {
            ...glowBase["&::before, &::after"],
            background:
                "conic-gradient(from var(--gradient-angle), var(--red-1), var(--red-3), var(--red-4), var(--red-2), var(--red-1))",
        },
    },
    info: {
        ...glowBase,
        background: "linear-gradient(180deg, var(--blue-2), var(--blue-4))",
        border: "1px solid var(--blue-5)",
        color: "var(--blue-7)",
        "&::before, &::after": {
            ...glowBase["&::before, &::after"],
            background:
                "conic-gradient(from var(--gradient-angle), var(--blue-1), var(--blue-4), var(--blue-7), var(--blue-5), var(--blue-1))",
        },
    },
    warning: {
        ...glowBase,
        background: "linear-gradient(180deg, var(--yellow-2), var(--yellow-4))",
        border: "1px solid var(--yellow-5)",
        color: "var(--yellow-1)",
        "&::before, &::after": {
            ...glowBase["&::before, &::after"],
            background:
                "conic-gradient(from var(--gradient-angle), var(--yellow-1), var(--yellow-3), var(--yellow-5), var(--yellow-2), var(--yellow-1))",
        },
    },
};

