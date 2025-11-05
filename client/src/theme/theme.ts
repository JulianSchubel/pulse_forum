import { createTheme } from "@mui/material/styles";
import { green } from "@mui/material/colors";

declare module "@mui/material/styles" {
    interface Theme {
        customColors: {
            purple: Record<number, string>;
            green: Record<number, string>;
            blue: Record<number, string>;
            red: Record<number, string>;
            yellow: Record<number, string>;
        };
    }
    interface ThemeOptions {
        customColors?: {
            purple?: Record<number, string>;
            green?: Record<number, string>;
            blue?: Record<number, string>;
            red?: Record<number, string>;
            yellow?: Record<number, string>;
        };
    }
}

const theme = createTheme({
    palette: {
        primary: {
            /* Background colour */
            main: '#052b2f',
            /* Text colour*/
            contrastText: ""
        },
        secondary: {
            main: '#052b2f',
        },
        background: {
            default: "#073438",
            paper: "#0e4b50",
        },
        text: {
            /* default text colour */
            primary: '#1976d2',
            /* subtitles, hints, etc */
            secondary: ''
        }
    },
    typography: {
        fontFamily: '"hurmit", "departure-mono", "big-blue", monospace',
        allVariants: {
            /* ensures all Typography components inherit this colour */
            color: "#73AF55",
        },
        h1: { fontFamily: "departure-mono", fontWeight: 700, fontSize: '2.5rem' },
        h2: { fontFamily: "departure-mono", fontWeight: 600 },
        h3: { fontFamily: "departure-mono", fontWeight: 400 },
        h4: { fontFamily: "departure-mono", fontWeight: 400 },
        h5: { fontFamily: "hurmit", fontWeight: 400 },
        h6: { fontFamily: "hurmit", fontWeight: 400 },
        body1: { fontFamily: "hurmit", fontSize: '1rem' },
        body2: { fontFamily: "hurmit" },
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "@font-face": [
                    {
                        fontFamily: "departure-mono",
                        src: `url("./assets/fonts/departure_mono/DepartureMonoNerdFontPropo-Regular.otf") format("opentype")`,
                    },
                    {
                        fontFamily: "hurmit",
                        src: `url("./assets/fonts/hurmit/HurmitNerdFont-Regular.otf") format("opentype")`,
                    },
                    {
                        fontFamily: "big-blue",
                        src: `url("./assets/fonts/big_blue_terminal/BigBlueTerm437NerdFontMono-Regular.ttf") format("truetype")`,
                    },
                ],
                body: {
                    background: "var(--green-2)",
                    fontFamily: '"hurmit", monospace',
                    color: "var(--green-6)",
                    margin: 0,
                    padding: 0,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    /* text colour for all buttons */
                    color: "var(--green-8)",
                    /* optional: keep text normal case */
                    textTransform: "none",
                    "&:hover": {
                        backgroundColor: green[50],
                    },
                    "&:focus": {
                        outline: `2px solid var(--green-1)`,
                        outlineOffset: "2px",
                    },
                },
            },
            variants: [
                {
                    props: { variant: "contained" },
                    style: {
                        backgroundColor: "var(--green-2)",
                        color: "",
                        "&:hover": {
                            backgroundColor: "var(--green-3)",
                        },
                    },
                },
                {
                    props: { variant: "outlined" },
                    style: {
                        borderColor: "var(--green-6)",
                        "&:hover": {
                            backgroundColor: "rgba(0,255,149,0.1)",
                            borderColor: "var(--green-7)",
                        },
                    },
                },
            ],
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        /* focus ring colour for text fields */
                        borderColor: green[700],
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    "&.Mui-focused": {
                        /* label colour on focus */
                        color: green[700],
                    },
                },
            },
        },
    },

    customColors: {
        purple: {
            1: "#b100cd",
            2: "#a000c8",
            3: "#8a00c2",
            4: "#7600bc",
            5: "#4c00b0",
            6: "#E1D5E7",
            7: "#FF99FF",
        },
        green: {
            1: "#052b2f",
            2: "#073438",
            3: "#0e4b50",
            4: "#2d8f85",
            5: "#636c54",
            6: "#73AF55",
            7: "#00ff95",
            8: "#82B366",
            9: "#1976d2",
        },
        blue: {
            1: "#243c5a",
            2: "#09009f",
            3: "#1A5FB4",
            4: "#1C71D8",
            5: "#3584E4",
            6: "#62A0EA",
            7: "#99C1F1",
            8: "#43ECFF",
        },
        red: {
            1: "#D06079",
            2: "#BF4040",
            3: "#B85450",
            4: "#FF3333",
        },
        yellow: {
            1: "#ffde1a",
            2: "#ffce00",
            3: "#ffa700",
            4: "#ff8d00",
            5: "#ff7400",
            6: "#FFA127",
        },
    },
});

export { theme };
export default theme;
