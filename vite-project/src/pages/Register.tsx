import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar.tsx";
import Swal from "sweetalert2";

const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
    role: z.enum(["student", "instructor"], "Role is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<RegisterFormData>({
        resolver: zodResolver (registerSchema),
    });

    const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
    const isInstructor = loggedInUser?.role === "instructor";
    const availableRoles = isInstructor ? ["student", "instructor"] : ["student"];

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const response = await fetch(`${BASE_URL}/users/register`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Registration Successful!",
                    text: "You can login with your new account.",
                    confirmButtonColor: "#3085d6",
                }).then(() => {
                    navigate("/");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Registration Failed!",
                    text: result.message || "User already exists!",
                })
            }
        } catch (error) {
            console.log("Network error:", error);
            await Swal.fire({
                icon: "error",
                title: "Network Error",
                text: "Please check your connection and try again.",
            });
        }
    };

    return (
        <>
            {isInstructor && <Navbar />}

            <div className="flex justify-center items-center min-h-screen bg-gray-50 pt-24">
                <Card className="w-[400px]">
                    <CardHeader>
                        <CardTitle>Create Account</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                            <div>
                                <Label>Name</Label>
                                <Input {...register("name")} placeholder="Name" />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                            </div>

                            <div>
                                <Label>Username</Label>
                                <Input {...register("username")} placeholder="Username" />
                                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                            </div>

                            <div>
                                <Label>Password</Label>
                                <Input type="password" {...register("password")} />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </div>

                            <div>
                                <Label>Confirm Password</Label>
                                <Input type="password" {...register("confirmPassword")} />
                                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                            </div>

                            <div>
                                <Label>Role</Label>
                                <Select onValueChange={(value) => setValue("role", value as "student" | "instructor")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableRoles.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                            </div>

                            <Button type="submit" className="w-full">Register</Button>

                            <p className="text-sm text-center mt-2">
                                Already have an account?{" "}
                                <a className="text-blue-500" href="/">
                                    Login
                                </a>
                            </p>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}