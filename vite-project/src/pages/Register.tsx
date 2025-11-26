import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";


const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
    role: z.enum(["student", "instructor"], "Role is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type RegisterForData = z.infer<typeof registerSchema>;

export default function Register() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<RegisterForData>({
        resolver: zodResolver(registerSchema)
    });

    // Get logged-in user from localStorage (or context)
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
    const isInstructor = loggedInUser?.role === "instructor";

    // Only instructors can select both student and instructor roles
    const availableRoles = isInstructor ? ["student", "instructor"] : ["student"];

    const onSubmit = async (data: RegisterForData) => {
        try {
            const response = await fetch(`${BASE_URL}/users/register`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.json();

            if (response.ok) {
                alert("User registered successfully!");
                console.log("Response:", result);
            } else {
                alert(result.message || "Registration failed");
                console.error("Error:", result);
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Network error. Please try again.");
        }
    };


    return (
        <>
            {isInstructor && <Navbar />}   {/* ✅ Show Navbar only for instructors */}

            <div className="flex justify-center items-center min-h-screen bg-gray-50 pt-24">
                <Card className="w-[400px]">
                    <CardHeader>
                        <CardTitle>Create Account</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                            {/* Name */}
                            <div>
                                <Label>Name</Label>
                                <Input {...register("name")} placeholder="John Doe" />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                            </div>

                            {/* Username */}
                            <div>
                                <Label>Username</Label>
                                <Input {...register("username")} placeholder="johndoe" />
                                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <Label>Password</Label>
                                <Input type="password" {...register("password")} />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <Label>Confirm Password</Label>
                                <Input type="password" {...register("confirmPassword")} />
                                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                            </div>

                            {/* Role */}
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
                                Already have an account? <a className="text-blue-500" href="/login">Login</a>
                            </p>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );

}
