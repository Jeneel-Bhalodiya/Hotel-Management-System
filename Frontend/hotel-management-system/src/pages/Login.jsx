import { useState } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import RoleSelector from "../components/RoleSelector";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Login() {
    const [role, setRole] = useState("admin");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let newErrors = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
        ) {
            newErrors.email = "Invalid email address";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password =
                "Password must be at least 6 characters";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = (e) => {
        e.preventDefault();

        if (validateForm()) {
        }
    };

    return (
        <div className="relative min-h-screen bg-slate-950 flex items-center justify-center">
            <AnimatedBackground />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-md p-8 backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20"
            >
                <h1 className="text-4xl text-white font-bold text-center">
                    Hotel Management
                </h1>

                <p className="text-center text-gray-400 mt-2">
                    Welcome Back!!
                </p>

                <div className="mt-6">
                    <RoleSelector
                        role={role}
                        setRole={setRole}
                    />
                </div>

                <form
                    onSubmit={handleLogin}
                    className="space-y-4 mt-6"
                >
                    <div>
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            className={`w-full p-3 rounded-xl bg-slate-900 text-white outline-none border ${
                                errors.email
                                    ? "border-red-500"
                                    : "border-transparent"
                            }`}
                        />

                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            className={`w-full p-3 rounded-xl bg-slate-900 text-white outline-none border ${
                                errors.password
                                    ? "border-red-500"
                                    : "border-transparent"
                            }`}
                        />

                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-amber-500 py-3 rounded-xl font-bold hover:bg-amber-400 transition"
                    >
                        Login as {role}
                    </button>

                    <p className="text-center text-gray-400 mt-4">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-amber-400 hover:text-amber-300"
                        >
                            Sign Up
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}