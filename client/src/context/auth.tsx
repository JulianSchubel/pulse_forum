import { createContext, useState, ReactNode, useEffect } from "react";
import { 
    User,
    ApiResponse,
    Result,
} from "@src/types";
import httpClient from "@src/api/client";

export type AuthContextType = {
    user: User | null;
    register: (username: string, password: string) => Promise<Result<User>>;
    login: (username: string, password: string) => Promise<Result<User>>;
    logout: () => void;
    authenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const USER_STORAGE_IDENTIFIER = "user";

    const login = async (username: string, password: string): Promise<Result<User>> => {
        try {
            console.log("Login");
            const response = await httpClient.post<void, ApiResponse<User>>("/api/auth/login", { username, password });

            console.log(response)
            if(!response.isError) {
                console.log(response);
                localStorage.setItem(USER_STORAGE_IDENTIFIER, JSON.stringify(response.body));
                setAuthenticated(true);
                setUser(response.body);
                return Result.ok(response.body as User);
            } else {
                return Result.error( new Error("Invalid username or password"));
            }
        } catch {
            return Result.error( new Error("An unexpected error occurred. Please try again later."));
        }
    };

    const logout = async () => {
        try {
            const response = await httpClient.post<void, ApiResponse<void>>("/api/auth/logout");
            if(!response.isError) {
                localStorage.removeItem(USER_STORAGE_IDENTIFIER);
                setAuthenticated(false);
                setUser(null);
                return Result.ok({});
            } else {
                return Result.error(new Error("Failed to logout user"));
            }
        } catch {
            return Result.error(new Error("An unexpected error occurred"));
        }
    };

    const register = async (username: string, password: string) => {
        try {
            const response = await httpClient.post<void, ApiResponse<User>>("api/auth/register", {username, password});
            if(!response.isError) {
                setUser(response.body);
                setAuthenticated(true);
                localStorage.setItem(USER_STORAGE_IDENTIFIER, JSON.stringify(response.body));
                return Result.ok(response.body);
            } else {
                return Result.error(new Error("Failed to register user"));
            }
        } catch {
            return Result.error(new Error("An unexpected error occurred"));
        }
    }

    useEffect(() => {
        const getUser = async() => {
            const storedUser = localStorage.getItem(USER_STORAGE_IDENTIFIER);
            if(storedUser) {
                setUser(JSON.parse(storedUser));
                setAuthenticated(true);
            } else {
                setAuthenticated(false);
                setUser(null);
            }
        };
        getUser();
    }, []);

    const value = {
        user,
        register,
        login,
        logout,
        authenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
export default AuthContext;
