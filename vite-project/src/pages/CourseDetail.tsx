import Navbar from "@/components/Navbar.tsx";
import { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourseById, enrollToCourse } from "@/services/courseService";
import Swal from "sweetalert2";

interface Student {
    _id: string;
    name: string;
}

interface Instructor {
    _id: string;
    name: string;
}

interface Course {
    _id: string;
    title: string;
    description: string;
    content: string;
    instructor: Instructor;
    enrolledUsers: Student[];
    isEnrolled?: boolean;
}

export default function CourseDetail() {
    const { id } = useParams();
    const [ loading, setLoading ] = useState(true);
    const [ enrolling, setEnrolling ] = useState(false);
    const [ course, setCourse ] = useState<Course | null >(null);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isStudent = user?.role === "student";
    const isInstructor = user?.role === "instructor";

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourseById(id!);
                setCourse(data);
            } catch (err){
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [id]);

    if (loading || !course) {
        return (
            <>
            <Navbar/>
                <div className="flex justify-center items-center h-[70vh]">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </>
        );
    }

    const alreadyEnrolled = course.isEnrolled;
    const handleEnroll = async () => {
        if (alreadyEnrolled) return;

        const result = await Swal.fire({
            title: "Enroll in this course?",
            text: "Are you sure you want to enroll?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, enroll me",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                setEnrolling(true);
                await enrollToCourse(id!);

                const  updateCourse = await getCourseById(id!);
                setCourse(updateCourse);

                await Swal.fire({
                    icon: "success",
                    title: "Enrolled!",
                    text: "You have successfully enrolled in this course.",
                });
            } catch (err) {
                console.log(err);
                await Swal.fire({
                    icon: "error",
                    title: "Enrollment Failed",
                    text: "Something went wrong. Please try again later.",
                });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <Navbar />

            <div className="pt-24 p-6 flex flex-col items-center gap-4 min-h-screen">

                <Card className="max-w-2xl w-full">
                    <CardHeader>
                        <CardTitle>{course.title}</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4 text-gray-700">
                        <p><strong>Description:</strong> {course.description}</p>
                        <p><strong>Content:</strong> {course.content}</p>
                        <p><strong>Instructor:</strong> {course.instructor?.name}</p>

                        {isStudent && (
                            <Button
                                onClick={handleEnroll}
                                className="w-full"
                                disabled={alreadyEnrolled || enrolling}
                            >
                                {alreadyEnrolled
                                    ? "Enrolled"
                                    : enrolling
                                        ? "Enrolling..."
                                        : "Enroll Now"}
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {isInstructor && course.enrolledUsers?.length > 0 && (
                    <Card className="max-w-2xl w-full mt-4">
                        <CardHeader>
                            <CardTitle>Enrolled Students</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <ul className="space-y-2">
                                {course.enrolledUsers.map((student: Student) => (
                                    <li key={student._id} className="p-2 border rounded bg-gray-50">
                                        <strong>{student.name}</strong>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {isInstructor && course.enrolledUsers?.length === 0 && (
                    <p className="text-gray-500 mt-4">No students enrolled yet.</p>
                )}
            </div>
        </>
    );


}
