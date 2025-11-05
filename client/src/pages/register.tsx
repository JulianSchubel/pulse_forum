import { useState } from "react";
import { Box, Button, Typography, Alert, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/auth";
import { ThemedBox } from "@src/components/themed_box";

type RegisterFormData = {
    username: string;
    password: string;
    confirmPassword: string;
};

export default function RegisterPage() {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>();

    const username = watch("username", "");
    const password = watch("password", "");
    const confirmPassword = watch("confirmPassword", "");
    const isFormValid = username.trim().length > 0 
        && password.length > 0 
        && password === confirmPassword;

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const result = await registerUser(data.username, data.password);
            if(result.ok) {
                navigate("/forum");
            } else {
                setError(result.error.message)
            }
        } catch {
            setError("Unable to register. Please try again later.");
        }
    };

    return (
        <Box className="flex flex-col items-center justify-center min-h-screen px-4">
            <ThemedBox className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-md">
                <Typography variant="h5" align="center" gutterBottom>
                    Create Account
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
                            {...register("username", { required: "Username is required" })}
                            className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-(--var-green-2)"
                            placeholder="Choose a username"
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
                                placeholder="Create a password"
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

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Confirm Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (val) => val === password || "Passwords do not match",
                            })}
                            className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-(--var-green-2)"
                            placeholder="Re-enter your password"
                        />
                        {errors.confirmPassword && (
                            <p className="var(--green-8) text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting ? "Registering..." : "Register"}
                    </Button>

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 1 }}
                        onClick={() => navigate("/login")}
                    >
                        Back to Login
                    </Button>
                </form>
            </ThemedBox>
        </Box>
    );
}


