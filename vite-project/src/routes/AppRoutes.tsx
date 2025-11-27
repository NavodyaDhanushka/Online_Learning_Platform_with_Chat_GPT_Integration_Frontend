import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import CourseDetail from "../pages/CourseDetail.tsx";
import CreateCourse from "@/pages/CreateCourse.tsx";
import MyCourses from "@/pages/MyCourses.tsx";
import AiSuggestion from "@/pages/AiSuggestion.tsx";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Authenticated Routes */}
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute allowedRoles={["student", "instructor"]}>
                            <Home />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/course/:id"
                    element={
                        <ProtectedRoute allowedRoles={["student", "instructor"]}>
                            <CourseDetail />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-courses"
                    element={
                        <ProtectedRoute allowedRoles={["student", "instructor"]}>
                            <MyCourses />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/create-course"
                    element={
                        <ProtectedRoute allowedRoles={["instructor"]}>
                            <CreateCourse />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ai-suggestion"
                    element={
                        <ProtectedRoute allowedRoles={["student", "instructor"]}>
                            <AiSuggestion />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
