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
                    <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            {/* Add padding-top so content is not hidden under fixed navbar */}
            <div className={`flex-grow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-[64px]`}>
                {courses.map((course: any) => (
                    <Card
                        key={course._id}
                        className="cursor-pointer hover:shadow-lg transition relative"
                        onClick={() => navigate(`/course/${course._id}`, { state: course })}
                    >
                        {/* Badge */}
                        {course.isEnrolled && (
                            <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
            Enrolled
        </span>
                        )}

                        <CardHeader>
                            <CardTitle>{course.title}</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <p className="text-gray-600">{course.description}</p>
                        </CardContent>
                    </Card>

                ))}
            </div>
        </div>
    );
}
