
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
        );
    }

    return isAuthenticated
        ? <Navigate to="/dashboard" replace />
        : children;
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>

               <Toaster
                    position="top-right"
                    reverseOrder={false}
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: "#ffffff",
                            color: "#1e293b",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            padding: "14px 16px",
                            fontSize: "14px",
                            fontWeight: "500",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                        },
                        success: {
                            iconTheme: {
                                primary: "#16a34a",
                                secondary: "#ffffff",
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: "#dc2626",
                                secondary: "#ffffff",
                            },
                        },
                    }}
                />

                <Routes>
                    <Route
                        path="/signup"
                        element={
                            <PublicRoute>
                                <Signup />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/signin"
                        element={
                            <PublicRoute>
                                <Signin />
                            </PublicRoute>
                        }
                    />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
