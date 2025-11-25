import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { getCourseById, enrollToCourse } from "@/services/courseService";

export default function CourseDetails() {
    const { id } = useParams();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isStudent = user?.role === "student";
    const isInstructor = user?.role === "instructor";

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await getCourseById(id!);
                setCourse(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    if (loading || !course) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center h-[70vh]">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </>
        );
    }

    // 👇 Now we use backend value directly
    const alreadyEnrolled = course.isEnrolled;

    const handleEnroll = async () => {
        if (alreadyEnrolled) return; // stop double clicking

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

                // Fetch fresh data with isEnrolled: true
                const updatedCourse = await getCourseById(id!);
                setCourse(updatedCourse);

                await Swal.fire({
                    icon: "success",
                    title: "Enrolled!",
                    text: "You have successfully enrolled in this course.",
                });
            } catch (err) {
                console.error(err);
                await Swal.fire({
                    icon: "error",
                    title: "Enrollment Failed",
                    text: "Something went wrong. Please try again later.",
                });
            } finally {
                setEnrolling(false);
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

                        {/* STUDENT VIEW */}
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

                {/* INSTRUCTOR VIEW: Enrolled Students */}
                {isInstructor && course.enrolledUsers?.length > 0 && (
                    <Card className="max-w-2xl w-full mt-4">
                        <CardHeader>
                            <CardTitle>Enrolled Students</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <ul className="space-y-2">
                                {course.enrolledUsers.map((student: any) => (
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
