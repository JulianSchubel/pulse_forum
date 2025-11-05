import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@context/auth";
import LoginPage from "@pages/login";
import ForumPage from "@pages/forum";
import RegisterPage from "@pages/register";

export default function App() {
    return (
        <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/login" element={<LoginPage />} />
                            <Route path="/forum" element={<ForumPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Routes>
                </BrowserRouter>
        </AuthProvider>
    );
}
