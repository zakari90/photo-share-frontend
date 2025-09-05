import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link } from "react-router-dom";

const RegisterFormSchema = z
  .object({
    username: z.string().min(1, { message: "Username is required" }),
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(3, { message: "Password must be at least 3 characters long" }),
    confirmPassword: z.string().min(1, { message: "Confirm Password is required" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

type FormData = z.infer<typeof RegisterFormSchema>;

export default function RegistrationPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(RegisterFormSchema),
  });

  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsPending(true);
    try {
      console.log("Form Data:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // simulate API call
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            {...register("username")}
            placeholder="Username"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm Password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
            <div>
        <button
          disabled={isPending}
          type="submit"
          className={`            `}
        >
          {isPending ? "Loading..." : "LogIn"}
        </button>
        <p>
          allredy have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </div>

      </form>
    </div>
  );
}
