import { Button, styled } from "@mui/material";
import { glowVariants, GlowVariant } from "@src/theme/glow_variants";

interface ThemedButtonProps {
    variant?: GlowVariant;
    children?: React.ReactNode;
    className?: string;
}

export const ThemedButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== "variant",
})<ThemedButtonProps>(({ variant = "default" }) => ({
    ...glowVariants[variant as GlowVariant],
    textTransform: "none",
    fontWeight: 600,
    padding: "0.75rem 1.5rem",
    "&:hover": {
        transform: "scale(1.02)",
        boxShadow: "0 0 20px rgba(255,255,255,0.2)",
    },
}));
