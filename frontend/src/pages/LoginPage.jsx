import { Link } from "react-router-dom"

export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-[350px]">
                <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full mb-4 p-2 border rounded-md"
                />


                <button className="w-full bg-blue-600 text-white p-2 rounded-md">
                    get verification code
                </button>
            </div>
        </div>
    )
}