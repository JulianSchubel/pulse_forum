import { Box, styled } from "@mui/material";
import { glowVariants, GlowVariant } from "@src/theme/glow_variants";

interface ThemedBoxProps {
  variant?: GlowVariant;
  children?: React.ReactNode;
  className?: string;
}

export const ThemedBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "variant",
})<ThemedBoxProps>(({ variant = "default" }) => glowVariants[variant]);
