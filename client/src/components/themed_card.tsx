import { Card, styled } from "@mui/material";
import { glowVariants, GlowVariant } from "../theme/glowVariants";

interface ThemedCardProps {
    variant?: GlowVariant;
    children?: React.ReactNode;
    className?: string;
}

export const ThemedCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== "variant",
})<ThemedCardProps>(({ variant = "default" }) => {
    const style = glowVariants[variant as GlowVariant];
    return {
        ...style,
        padding: "1rem",
        overflow: "hidden",
    };
});
