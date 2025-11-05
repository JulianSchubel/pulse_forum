import { useState } from "react";
import { Box, Button, Typography, Alert, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth";
import { ThemedBox } from "@src/components/themed_box";
import PulseLogo from "@src/components/logo/pulse_logo";

type LoginFormData = {
    username: string;
    password: string;
};

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>();

    const username = watch("username", "");
    const password = watch("password", "");
    const isFormValid = username.trim().length > 0 && password.length > 0;

    const onSubmit = async (data: LoginFormData) => {
        const result = await login(data.username, data.password);
        console.log(username, password);
        if (result.ok) {
            navigate("/forum");
        } else {
            setError("Invalid username or password");
        }
    }

    return (
        <Box className="flex flex-col items-center justify-center min-h-screen px-4">
            <PulseLogo />
            <Typography variant="h5" gutterBottom>
                Power on. Plug in. Feel the Pulse.
            </Typography>
            <ThemedBox className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-md">
                <Typography variant="h6" align="center" gutterBottom>
                    Login
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            {...register("username", { 
                                required: "Username is required" ,
                                minLength: { value: 3, message: "Username must be at least 3 characters" },
                            })}
                            className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-(--var-green-2)"
                            placeholder="Enter your username"
                        />
                        {errors.username && (
                            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                                })}
                                className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-(--var-green-2)"
                                placeholder="Enter your password"
                            />
                            <InputAdornment position="end" className="absolute right-2 top-2">
                                <IconButton
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    edge="end"
                                    size="small"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </Button>

                    <Button variant="contained" fullWidth sx={{ mt: 1 }} onClick={() => navigate("/forum")}>
                        Continue as Guest
                    </Button>

                    <Button variant="contained" fullWidth sx={{ mt: 1 }} onClick={() => navigate("/register")}>
                        Create Account
                    </Button>
                </form>
            </ThemedBox>
        </Box>
    );

};
