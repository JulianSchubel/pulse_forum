import React, { useEffect, useState } from "react";
import { Fab, Zoom } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";

const ScrollToTopButton: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <Zoom in={visible}>
            <Fab
                color="primary"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                sx={{ position: "fixed", bottom: 24, right: 24 }}
            >
                <KeyboardArrowUp />
            </Fab>
        </Zoom>
    );
};

export default ScrollToTopButton;

