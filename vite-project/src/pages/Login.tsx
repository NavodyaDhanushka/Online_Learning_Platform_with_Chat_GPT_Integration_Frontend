import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {zodResolver} from "@hookform/resolvers/zod";

const loginSchema = z.object({
    username: z.string(),
    password: z.string().min(8).max(100)
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver (loginSchema),
    });

    const onSubmit = (data: LoginFormData) => {
        console.log("Login Data:", data);
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