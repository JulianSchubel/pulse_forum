import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "../index.css";
import { NavigationProvider } from "./context/navigation";
import App from './components/app/app.tsx';
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from './theme/theme.ts';

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <NavigationProvider>
                    <App />
            </NavigationProvider>
        </ThemeProvider>
    </StrictMode>,
);
