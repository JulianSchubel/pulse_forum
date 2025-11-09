import React from "react";
import { Typography, List, ListItem, ListItemText } from "@mui/material";
import { ThemedCard } from "@src/components/themed_card";
import type { GlowVariant } from "@src/theme/glow_variants";

export interface ForumRulesCardProps {
    variant?: GlowVariant;
    title?: string;
    rules?: string[];
    className?: string;
}

const FORUM_RULES = [
    "Be respectful.",
    "Be kind.",
    "Be constructive",
    "TL;DR: Don't be a douche.",
];

export const ForumRulesCard: React.FC<ForumRulesCardProps> = ({
    variant = "default",
    title = "Forum Rules",
    rules = FORUM_RULES,
    className,
}) => {
    return (
        <ThemedCard
            variant={variant}
            className={className}
            sx={{
                width: 250,
                borderRadius: "1rem",
                boxShadow: "0 0 20px rgba(100,100,255,0.2)",
            }}
        >
            <Typography
                variant="body2"
            >
                {title}
            </Typography>

            <List dense disablePadding>
                {rules.map((rule, idx) => (
                    <ListItem key={idx}>
                        <ListItemText
                            primary={`∙ ${rule}`}
                        />
                    </ListItem>
                ))}
            </List>
        </ThemedCard>
    );
};

