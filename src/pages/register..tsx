
import { register } from '../actions/request';
import { useActionState } from 'react';

     

export default function RegisterPage() {

    const [state, action, isPending] = useActionState(register,undefined)

    return (
        <div className="m-auto bg-white p-8 rounded-lg shadow-md w-96">
            <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
            <form action={action} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        name="username"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        
                    />
                    {state?.error?.username && ( <p className="text-red-500 text-sm mt-1">{state.error.username}</p>)}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        
                    />
                    {state?.error?.email && ( <p className="text-red-500 text-sm mt-1">{state.error.email}</p>)}

                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        
                    />
                    {state?.error?.password && ( <p className="text-red-500 text-sm mt-1">{state.error.password}</p>)}

                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        
                    />
                </div>
                {state?.error?.confirmPassword && ( <p className="text-red-500 text-sm mt-1">{state.error.confirmPassword}</p>)}
                <button
                    disabled={isPending}
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    {isPending? "Loading..." : "Register"}
                </button>
            </form>
        </div>

    );
}