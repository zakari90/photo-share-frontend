import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import instance from "../config/axios";
import { REGISTER_URL } from "../config/urls";
import AuthContext from "../context/auth-context";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);  

  const [isPending, setIsPending] = useState(false);
      const value = useContext(AuthContext)
  
  useEffect(() => {}, [value]);

  const onSubmit = async (data: FormData) => {
    setIsPending(true);
    try {
      const res = await instance.post(REGISTER_URL, data);
      const token = res.data.accessToken
      const userId = res.data.userId
      const username = res.data.username
      value.login(token, userId, username)
    } catch (error: any) {
        console.error("Server error:", error.response.data);
      setErrorMessage(
        error?.response.data.message || "Registration failed. Please try again later."
      );

    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-white m-auto p-8 rounded-lg shadow-md w-96">
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
{errorMessage &&
<div className="p-4 text-center rounded-md bg-red-50">
      <p className="text-red-500 mb-4">{errorMessage}</p>
    </div>}
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
          className="hover:cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md w-full"
        >
          {isPending ? "Loading..." : "Register"}
        </button>
        <p>
          allredy have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </div>

      </form>
    </div>
  );
}
