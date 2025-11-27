import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button} from "@/components/ui/button.tsx";

export default function Navbar(){
    const location = useLocation();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isInstructor = user?.role === "instructor";

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    return(
        <nav className="bg-white shadow px-4 py-3 flex justify-between items-center fixed top-0 left-0 w-full z-50">
            <div className="flex space-x-4">
                <Link to="/home">
                    <Button variant={location.pathname === "/home" ? "default" : "outline"}>Home</Button>
                </Link>
                <Link to="/ai-suggestion">
                    <Button variant={location.pathname === "/ai-suggestion" ? "default" : "outline"}>AI Suggestion</Button>
                </Link>
                <Link to="/my-courses">
                    <Button variant={location.pathname === "/my-courses" ? "default" : "outline"}>My Courses</Button>
                </Link>
                {isInstructor && (
                    <Link to="/create-course">
                        <Button variant={location.pathname === "/create-course" ? "default" : "outline"}>New Course</Button>
                    </Link>
                )}
                {isInstructor && (
                    <Link to="/register">
                        <Button variant={location.pathname === "/register" ? "default" : "outline"}>Register New Instructor</Button>
                    </Link>
                )}
            </div>

            <div>
                {user?(
                    <Button onClick={handleLogout}>Logout</Button>
                ) : (
                    <Link to="/">
                        <Button variant={location.pathname === "/" ? "default" : "outline"}>Login</Button>
                    </Link>
                )}
            </div>
        </nav>
    );
}