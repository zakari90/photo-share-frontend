import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const RegisterFormSchema = z.object(
    {
        username: z.string().min(1, { message: "Username is required" }),
        email: z.email({ message: "Invalid email address" }),
        password: z.string().min(1, { message: "Password must be at least 6 characters long" }),
        confirmPassword: z.string().min(1, { message: "Confirm Password is required" }),
    }
).superRefine((data, ctx) =>{
    if(data.password !== data.confirmPassword){
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",  
            path: ['confirmPassword'],
        })
    }

} )

type FormData = z.infer<typeof RegisterFormSchema>;

export default function RegisterationPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(RegisterFormSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>user name</label>
        <input {...register("username")} />
        {errors.username && <p>{errors.username.message}</p>}
      </div>

      <div>
        <label>Email</label>
        <input {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label>Password</label>
        <input type="password" {...register("password")} />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
       <div>
        <label>Password</label>
        <input type="confirmPassword" {...register("confirmPassword")} />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
