import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Tooltip,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useAuth } from "../hooks/auth";
import { useNavigate } from "react-router-dom";
import { ThemedBox } from "./themed_box";
import PulseLogo from "./logo/pulse_logo";

export const ForumNavbar: React.FC = () => {
    const { authenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleAuthAction = async () => {
        if (authenticated) {
            await logout();
            navigate("/");
        } else {
            navigate("/");
        }
    };

    return (
        <AppBar position="sticky" color="primary" className="mb-4">
            <ThemedBox>
                <Toolbar className="flex justify-between">
                    <Typography
                        onClick={() => navigate("/")}
                        className="cursor-pointer"
                    >
                        Pulse Forum
                    </Typography>
                    <PulseLogo />
                    <Box className="flex items-center gap-4">
                        <Tooltip title="Scroll to top">
                            <IconButton color="inherit" onClick={handleScrollToTop}>
                                <ArrowUpwardIcon />
                            </IconButton>
                        </Tooltip>

                        <Button color="inherit" onClick={handleAuthAction}>
                            <Typography>
                                {authenticated ? "Logout" : "Login"}
                            </Typography>
                        </Button>
                    </Box>
                </Toolbar>
            </ThemedBox>
        </AppBar>
    );
};
