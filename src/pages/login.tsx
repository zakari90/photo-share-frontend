import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link } from 'react-router-dom';

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
        <input {...register("email")}
        placeholder="Email"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"

        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <input type="password" {...register("password")}
        placeholder="Password"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"

        />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <div>
        <button
          disabled={isPending}
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
        >
          {isPending ? "Loading..." : "LogIn"}
        </button>
        <p>
          Don't have an account? <Link to="/register" className="text-blue-500">Rgister</Link>
        </p>
      </div>

    </form>
    </div>
  );
}
