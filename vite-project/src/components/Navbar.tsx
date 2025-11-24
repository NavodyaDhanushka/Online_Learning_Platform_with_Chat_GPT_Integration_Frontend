import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const location = useLocation();

    return (
        <nav className="bg-white shadow px-4 py-3 flex justify-between items-center">
            <div className="flex space-x-4">
                <Link to="/">
                    <Button variant={location.pathname === "/" ? "default" : "outline"}>Home</Button>
                </Link>
                <Link to="/ai-suggestion">
                    <Button variant={location.pathname === "/ai-suggestion" ? "default" : "outline"}>AI Suggestion</Button>
                </Link>
                <Link to="/my-courses">
                    <Button variant={location.pathname === "/my-courses" ? "default" : "outline"}>My Courses</Button>
                </Link>
                <Link to="/create-course">
                    <Button variant={location.pathname === "/create-course" ? "default" : "outline"}>New Course</Button>
                </Link>
            </div>
        </nav>
    );
}