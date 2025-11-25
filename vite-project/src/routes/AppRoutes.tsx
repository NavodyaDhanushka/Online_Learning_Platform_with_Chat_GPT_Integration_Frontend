import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import CourseDetail from "../pages/CourseDetail.tsx";
import CreateCourse from "@/pages/CreateCourse.tsx";
import MyCourses from "@/pages/MyCourses.tsx";
import AiSuggestion from "@/pages/AiSuggestion.tsx";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/course/:id" element={<CourseDetail />} />
                <Route path="/create-course" element={<CreateCourse />} />
                <Route path="/my-courses" element={<MyCourses />} />
                <Route path="/ai-suggestion" element={<AiSuggestion />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;