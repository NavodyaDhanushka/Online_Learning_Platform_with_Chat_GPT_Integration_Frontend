import { z } from "zod";
import { useForm } from "react-hook-form";
import { useNavigate} from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input} from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


const loginSchema = z.object({
    username: z.string(),
    password: z.string().min(8).max(100),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver (loginSchema),
    });

    const navigate = useNavigate();

    const onSubmit = async (data: LoginFormData) => {
        try {
            const res = await fetch(`${BASE_URL}/users/login`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });

            const result = await res.json();


            if (!res.ok){
                Swal.fire({
                    icon: "error",
                    title: "Login failed.",
                    text: result.message || "Invalid Credentials",
                });
                return;
            }
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            await Swal.fire({
                icon: "success",
                title: "Login success",
                text: "Welcome back!",
                timer: 1500,
                showConfirmButton: false,
            });
            navigate("/home");
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-[380px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        <div>
                            <Label>Username</Label>
                            <Input {...register("username")} placeholder="username" />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                        </div>

                        <div>
                            <Label>Password</Label>
                            <Input type="password" {...register("password")} />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        <Button type="submit" className="w-full">Login</Button>

                        <p className="text-sm text-center mt-2">
                            Don't have an account? <a className="text-blue-500" href="/register">Register</a>
                        </p>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}