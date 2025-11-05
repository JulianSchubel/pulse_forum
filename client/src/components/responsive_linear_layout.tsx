import React, { ReactNode } from "react";
import { Box } from "@mui/material";

interface ResponsiveLinearLayoutProps {
    children: ReactNode;
}

const ResponsiveLinearLayout: React.FC<ResponsiveLinearLayoutProps> = ({ children }) => (
    <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        width="100%"
        maxWidth={800}
    >
        {children}
    </Box>
);

export default ResponsiveLinearLayout;

