import { lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const MainLayout = lazy(() => import("../layouts/MainLayout"));
const Login = lazy(() => import("../pages/Login/Login"));
const Register = lazy(() => import("../pages/Login/Register"));
const ForgotPassword = lazy(() => import("../pages/Login/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/Login/ResetPassword"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Products = lazy(() => import("../pages/Products/Products"));
const Categories = lazy(() => import("../pages/Categories/Categories"));
const Movements = lazy(() => import("../pages/Movements/Movements"));
const Suppliers = lazy(() => import("../pages/Suppliers/Suppliers"));
const Settings = lazy(() => import("../pages/Settings/Settings"));

function RouteFallback() {
    return (
        <Box
            sx={{
                minHeight: "100dvh",
                display: "grid",
                placeItems: "center",
                bgcolor: "#f8fafc"
            }}
        >
            <CircularProgress size={28} />
        </Box>
    );
}

function AppRoutes() {
    return (
        <BrowserRouter>
            <Suspense fallback={<RouteFallback />}>
                <Routes>

                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="/reset-password"
                        element={<ResetPassword />}
                    />

                    <Route element={<MainLayout />}>
                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/products"
                            element={<Products />}
                        />

                        <Route
                            path="/categories"
                            element={<Categories />}
                        />

                        <Route
                            path="/suppliers"
                            element={<Suppliers />}
                        />

                        <Route
                            path="/movements"
                            element={<Movements />}
                        />

                        <Route
                            path="/settings"
                            element={<Settings />}
                        />
                    </Route>

                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default AppRoutes;
