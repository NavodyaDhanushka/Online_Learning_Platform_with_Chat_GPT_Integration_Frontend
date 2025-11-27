import { z } from "zod";
import { useState } from "react";
import { useForm} from "react-hook-form";
import { zodResolver} from "@hookform/resolvers/zod";
import { useNavigate} from "react-router-dom";
import { Button} from "@/components/ui/button.tsx";
import { Input} from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { createCourse} from "@/services/courseService.tsx";
import Navbar from "@/components/Navbar.tsx";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const createCourseSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
    content: z.string().min(10, "Content must be at least 10 characters"),
});

type CreateCourseFormData = z.infer<typeof createCourseSchema>;

export default function CreateCourse() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<CreateCourseFormData>({
        resolver: zodResolver(createCourseSchema),
    });

    const user = JSON.parse(localStorage.getItem("user") || "{}" );

    if (user.role !== "instructor") {
        return (
            <>
                <Navbar />
                <div className="p-6 text-center text-red-500">
                    You are not authorized to create a course.
                </div>
            </>
        );
    }

    const onSubmit = async (data: CreateCourseFormData) => {
        setLoading(true);
        try {
            await createCourse(data);

            await Swal.fire({
                icon: "success",
                title: "Course Created!",
                text: "Your course has been added successfully.",
                timer: 2000,
                showConfirmButton: false,
            });
            navigate("/home");
        } catch (error) {
            console.log(error);

            await Swal.fire({
                icon: "error",
                title: "Creation Failed",
                text: "Something went wrong while creating the course.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="pt-24 p-6 flex flex-col items-center gap-4 min-h-screen">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle>Create New Course</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Label>Title</Label>
                                <Input {...register("title")} placeholder="Title" />
                                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                            </div>

                            <div>
                                <Label>Description</Label>
                                <Input {...register("description")} placeholder="Short description..." />
                                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                            </div>

                            <div>
                                <Label>Content</Label>
                                <Input {...register("content")} placeholder="Full course content..." />
                                {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Creating..." : "Create Course"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}