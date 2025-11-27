import { Navigate } from "react-router-dom";
import type { JSX } from "react";

interface User {
    username: string;
    role: "student" | "instructor";
    [key: string]: unknown;
}

interface ProtectedRouteProps {
    children: JSX.Element;
    allowedRoles: ("student" | "instructor")[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    // Get the user object from localStorage
    const user: User | null = JSON.parse(localStorage.getItem("user") || "null");

    // Redirect to login if user not found
    if (!user) return <Navigate to="/" replace />;

    // Redirect if user's role is not allowed
    if (!allowedRoles.includes(user.role)) return <Navigate to="/home" replace />;

    // Authorized, render children
    return children;
}
