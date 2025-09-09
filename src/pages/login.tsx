import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import instance from "../config/axios";
import { LOGIN_URL } from "../config/urls";
import AuthContext from "../context/auth-context";

const LoginFormSchema = z.object(
    {
        email: z.email({ message: "Invalid email address" }),
        password: z.string().min(1, { message: "Password must be at least 6 characters long" }),
    }
)

type FormData = z.infer<typeof LoginFormSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(LoginFormSchema),
  });

  const value = useContext(AuthContext);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);  
  useEffect(() => {}, [value]);
  const onSubmit = async (data: FormData) => {
    setIsPending(true);
    try {
      const res = await instance.post(LOGIN_URL, data);
      const token = res.data.accessToken
      const userId = res.data.userId
      const username = res.data.username
      value.login(token, userId, username)      
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage("Login failed. Please check your credentials and try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-white  m-auto mt-4 p-8 rounded-lg shadow-md w-96">
    <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
{errorMessage &&     <div className="p-4 text-center rounded-md bg-red-50">
      <p className="text-red-500 mb-4">{errorMessage}</p>
    </div>}
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      <div>
        <input {...register("email")}
        placeholder="Email"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"

        />
        {errors.email && <p
        className="text-red-500 text-sm mt-1"
        >{errors.email.message}</p>}
      </div>

      <div>
        <input type="password" {...register("password")}
        placeholder="Password"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"

        />
        {errors.password && <p 
        className="text-red-500 text-sm mt-1"
        >{errors.password.message}</p>}
      </div>
      <div>
        <button
          disabled={isPending}
          type="submit"
          className="hover:cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md w-full"
        >
          {isPending ? "Loading..." : "LogIn"}
        </button>
        <p>
          Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
        </p>
      </div>

    </form>
    </div>
  );
}
