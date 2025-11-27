import Navbar from "@/components/Navbar.tsx"
import CourseCard from "@/components/CourseCard.tsx";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getAllCourses } from "@/services/courseService.tsx";

interface Course {
    _id: string;
    title: string;
    description: string;
    isEnrolled?: boolean;
}

export default function Home() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getAllCourses();
                setCourses(data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-grow flex justify-center items-center pt-[64px]">
                    <Loader2 className="animate-spin w-12 h-12 text-blue-500"/>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-[64px]">
                {courses.map((course => (
                    <CourseCard
                    key={course._id}
                    id={course._id}
                    title={course.title}
                    description={course.description}
                    isEnrolled={course.isEnrolled}
                    />
                )))}
            </div>
        </div>
    );
}