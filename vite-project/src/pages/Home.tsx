import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getAllCourses } from "@/services/courseService";
import { Loader2 } from "lucide-react";

export default function Home() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getAllCourses(); // <-- calling backend
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
            <>
                <Navbar />
                <div className="flex justify-center items-center h-[70vh]">
                    <Loader2 className="animate-spin w-8 h-8" />
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course: any) => (
                    <Card
                        key={course._id}
                        className="cursor-pointer hover:shadow-lg transition"
                        onClick={() => navigate(`/course/${course._id}`, { state: course })}
                    >
                        <CardHeader>
                            <CardTitle>{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">{course.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}
