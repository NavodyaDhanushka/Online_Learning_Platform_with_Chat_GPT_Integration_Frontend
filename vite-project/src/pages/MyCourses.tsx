import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Swal from "sweetalert2";

import {
    getEnrolledUsers,
    getAssignCourses,
    deleteCourse,
    updateCourse
} from "@/services/courseService";

import CourseCard from "@/components/CourseCard";

interface User {
    _id: string;
    name: string;
    email: string;
    role: "student" | "instructor";
}

interface Course {
    _id: string;
    title: string;
    description: string;
    content: string;
    enrolledUsers?: User[];
}

export default function MyCourses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const user: User = JSON.parse(localStorage.getItem("user") || "{}");

    const fetchCourseList = async () => {
        try {
            let data: Course[] = [];

            if (user.role === "student") {
                const response = await getEnrolledUsers();
                data = response.courses || [];
            } else if (user.role === "instructor") {
                const response = await getAssignCourses();
                data = response.data || [];
            }

            setCourses(data);
        } catch (err) {
            console.error("Error fetching courses:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseList();
    }, []);

    const handleDelete = async (courseId: string) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This course will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!confirm.isConfirmed) return;

        try {
            await deleteCourse(courseId);

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Course deleted successfully.",
                timer: 1500,
                showConfirmButton: false
            });

            setTimeout(() => {
                navigate("/my-courses");
                window.location.reload();
            }, 1500);

        } catch (err) {
            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text: "Could not delete the course!",
            });
        }
    };

    const openEditModal = (course: Course) => {
        setSelectedCourse({ ...course });
        setEditModalOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedCourse?.title || !selectedCourse?.description || !selectedCourse?.content) {
            return Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please fill all fields before saving.",
            });
        }

        try {
            await updateCourse(selectedCourse._id, {
                title: selectedCourse.title,
                description: selectedCourse.description,
                content: selectedCourse.content,
            });

            Swal.fire({
                icon: "success",
                title: "Course Updated!",
                text: "Your changes were saved successfully.",
                timer: 1500,
                showConfirmButton: false
            });

            setEditModalOpen(false);

            setTimeout(() => {
                navigate("/my-courses");
                window.location.reload();
            }, 1500);

        } catch (err) {
            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: "Could not update the course.",
            });
        }
    };

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

            {/* EDIT POPUP */}
            {editModalOpen && selectedCourse && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Edit Course</h2>

                        <label className="text-sm font-medium">Title</label>
                        <Input
                            className="mb-3"
                            value={selectedCourse.title}
                            onChange={(e) =>
                                setSelectedCourse({ ...selectedCourse, title: e.target.value })
                            }
                        />

                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                            className="mb-3"
                            value={selectedCourse.description}
                            onChange={(e) =>
                                setSelectedCourse({ ...selectedCourse, description: e.target.value })
                            }
                        />

                        <label className="text-sm font-medium">Content</label>
                        <Textarea
                            className="mb-4 h-32"
                            value={selectedCourse.content}
                            onChange={(e) =>
                                setSelectedCourse({ ...selectedCourse, content: e.target.value })
                            }
                        />

                        <div className="flex gap-3 mt-4">
                            <Button className="w-1/2" onClick={handleUpdate}>
                                Save
                            </Button>
                            <Button
                                variant="destructive"
                                className="w-1/2"
                                onClick={() => setEditModalOpen(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* COURSES LIST */}
            <div className="pt-24 p-6 flex flex-col items-center gap-4 min-h-screen">
                {courses.length === 0 && (
                    <p className="text-gray-500">
                        {user.role === "student"
                            ? "You are not enrolled in any courses yet."
                            : "You have not been assigned any courses yet."}
                    </p>
                )}

                {courses.map((course) => (
                    <div key={course._id} className="w-full max-w-2xl">
                        <CourseCard
                            id={course._id}
                            title={course.title}
                            description={course.description}
                        />

                        {user.role === "instructor" && (
                            <div className="flex gap-3 mt-2">
                                <Button
                                    className="w-1/2"
                                    onClick={() => openEditModal(course)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="w-1/2"
                                    onClick={() => handleDelete(course._id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
