import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getAllCourses, getEnrolledUsers } from "@/services/courseService";

export default function MyCourses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                let data: any[] = [];
                if (user.role === "student") {
                    // Get courses student is enrolled in
                    data = await getEnrolledUsers();
                } else if (user.role === "instructor") {
                    // Get courses instructor created
                    data = await getAllCourses(); // optionally filter by instructor on backend
                    data = data.filter((c) => c.instructor?._id === user._id);
                }
                setCourses(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [user]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center h-[70vh]">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.length === 0 && (
                    <p className="col-span-full text-center text-gray-500">
                        {user.role === "student"
                            ? "You are not enrolled in any courses yet."
                            : "You have not created any courses yet."}
                    </p>
                )}

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
