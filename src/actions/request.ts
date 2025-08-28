import axios from "axios";
import { z } from "zod";

const BASE_URL = "http://localhost:3000/api";

const RegisterFormSchema = z.object(
    {
        username: z.string().min(1, { message: "Username is required" }),
        email: z.string().email({ message: "Invalid email address" }),
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

export async function register(state: unknown, formData: FormData) {

    try {
        const data = {
            username: formData.get("username"),
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword"),
          };    
        const result = RegisterFormSchema.safeParse(data);
        if (!result.success) {
            return{
                error: result.error.flatten().fieldErrors,
            };
        }

        const response = await axios.post(BASE_URL+
            "/auth/register", 
            data
        , { headers: { 
            "Content-Type": "application/json", }, }
        );       
        //save user data in local storage
        localStorage.setItem("user", JSON.stringify(response.data.user)); 
        return response.data;
    } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
          }
    }
}


const LoginFormSchema = z.object(
    {
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(1, { message: "Password must be at least 6 characters long" }),
    }
)

export async function login(state: unknown, formData: FormData) {
    try {
        const data = {
            email: formData.get("email"),
            password: formData.get("password"),
          };

        const result = LoginFormSchema.safeParse(data);
        if (!result.success) {
            console.log(result.error.format());
            console.log("Login validation failed:", result.error);
            
            return{
                error: result.error.flatten().fieldErrors,
            };
        }

        const response = await axios.post(BASE_URL+
            "/auth/login", data
        );

        return response.data;
    } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
          }
    }
}

export async function logout(){
    try {
            const response = await axios.post(BASE_URL+
                "/auth/logout"
            );

            return response.data;
    } catch (error) {
        console.log("logout error", error);
        
    }
    }


