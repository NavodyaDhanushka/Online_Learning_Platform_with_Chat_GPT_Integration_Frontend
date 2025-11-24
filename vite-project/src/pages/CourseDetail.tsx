import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

import {
    getCourseById,
    enrollToCourse,
    getEnrolledUsers,
    updateCourse,
    deleteCourse
} from "@/services/courseService";

export default function CourseDetails() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const courseFromState: any = location.state;

    const [course, setCourse] = useState<any>(courseFromState || null);
    const [loading, setLoading] = useState(!courseFromState);
    const [editOpen, setEditOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Fetch the full details if not passed via state
    useEffect(() => {
        if (!courseFromState && id) {
            const loadCourse = async () => {
                try {
                    const data = await getCourseById(id);
                    setCourse(data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            loadCourse();
        }
    }, [id, courseFromState]);

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

    /** ROLE CHECKS **/
    const isInstructorOwner =
        user?.role === "instructor" && user?._id === course?.instructor?._id;

    const isStudent = user?.role === "student";

    const alreadyEnrolled = course?.enrolledUsers?.some(
        (u: any) => u._id === user._id
    );

    /** ---- ENROLL ----- **/
    const handleEnroll = async () => {
        try {
            await enrollToCourse(id!);

            const updatedUsers = await getEnrolledUsers();

            setCourse({
                ...course,
                enrolledUsers: updatedUsers,
            });

            alert("Enrolled successfully!");
        } catch (err) {
            console.error(err);
            alert("Enroll failed");
        }
    };

    /** ---- EDIT COURSE ----- **/
    const [editForm, setEditForm] = useState({
        title: course.title,
        description: course.description,
        content: course.content,
    });

    const handleUpdateCourse = async () => {
        try {
            const updated = await updateCourse(id!, editForm);
            setCourse(updated);
            setEditOpen(false);

            alert("Course updated");
        } catch (error) {
            console.error(error);
            alert("Update failed");
        }
    };

    /** ---- DELETE COURSE ----- **/
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this course?")) return;

        try {
            await deleteCourse(id!);
            alert("Course deleted");
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    };

    return (
        <>
            <Navbar />

            <div className="p-6 flex flex-col items-center gap-4">

                {/* COURSE INFO */}
                <Card className="max-w-2xl w-full">
                    <CardHeader>
                        <CardTitle>{course.title}</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4 text-gray-700">
                        <p><strong>Description:</strong> {course.description}</p>
                        <p><strong>Content:</strong> {course.content}</p>
                        <p><strong>Instructor:</strong> {course.instructor?.name}</p>

                        {/* Student ENROLL */}
                        {isStudent && !alreadyEnrolled && (
                            <Button onClick={handleEnroll} className="w-full">
                                Enroll Now
                            </Button>
                        )}

                        {isStudent && alreadyEnrolled && (
                            <p className="text-green-600 font-semibold">
                                ✔ You are enrolled
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* ---- INSTRUCTOR ACTIONS ---- */}
                {isInstructorOwner && (
                    <div className="flex gap-3">
                        {/* EDIT */}
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <Button>Edit</Button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Course</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-3">
                                    <Input
                                        placeholder="Title"
                                        value={editForm.title}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, title: e.target.value })
                                        }
                                    />

                                    <Input
                                        placeholder="Description"
                                        value={editForm.description}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, description: e.target.value })
                                        }
                                    />

                                    <Input
                                        placeholder="Content"
                                        value={editForm.content}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, content: e.target.value })
                                        }
                                    />

                                    <Button onClick={handleUpdateCourse} className="w-full">
                                        Save Changes
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* DELETE */}
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                )}

                {/* ---- ENROLLED USERS LIST ---- */}
                {isInstructorOwner && (
                    <Card className="max-w-2xl w-full mt-4">
                        <CardHeader>
                            <CardTitle>Enrolled Students</CardTitle>
                        </CardHeader>

                        <CardContent>
                            {course.enrolledUsers?.length > 0 ? (
                                <ul className="space-y-2">
                                    {course.enrolledUsers.map((u: any) => (
                                        <li key={u._id} className="p-2 border rounded bg-gray-50">
                                            <strong>{u.name}</strong>
                                            <span className="text-gray-500 ml-2">@{u.username}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No students enrolled.</p>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
