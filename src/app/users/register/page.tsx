"use client";

import { UsersService } from "@/api/userApi";
import AuthPageShell from "@/app/components/auth-page-shell";
import ErrorAlert from "@/app/components/error-alert";
import { Button } from "@/app/components/button";
import { Input } from "@/app/components/input";
import { Label } from "@/app/components/label";
import { clientAuthProvider } from "@/lib/authProvider";
import { parseErrorMessage } from "@/types/errors";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
    username: string;
    email: string;
    password: string;
};

export default function RegistrationPage() {
    const service = new UsersService(clientAuthProvider);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setErrorMessage(null);
        return service.createUser(data)
            .then(() => {
                router.push("/login");
            })
            .catch((error) => {
                setErrorMessage(parseErrorMessage(error));
            });
    };

    return (
        <AuthPageShell
            eyebrow="Create account"
            title="Register"
            description="Create your account and continue to login."
        >
            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto grid max-w-xl gap-5">
                {errorMessage && <ErrorAlert message={errorMessage} />}
                <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        {...register("username", { required: "Username is required" })}
                    />
                    {errors.username && (
                        <p className="text-sm text-destructive">{errors.username.message}</p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email address",
                            },
                        })}
                    />
                    {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 8, message: "Minimum 8 characters" },
                            maxLength: { value: 256, message: "Maximum 256 characters" }
                        })}
                    />
                    {errors.password && (
                        <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                </div>

                <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Registering..." : "Register"}
                </Button>
            </form>
        </AuthPageShell>
    );
}
