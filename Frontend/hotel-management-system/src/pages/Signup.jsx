import { useState } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const navigate = useNavigate();

    const validateForm = () => {
        let newErrors = {};

        if (!username.trim()) {
            newErrors.username = "Username is required";
        }

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

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword =
                "Confirm Password is required";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword =
                "Passwords do not match";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setApiError("");

        if (validateForm()) {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password,
                        role: "ADMIN",
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    navigate("/");
                } else {
                    const errorMsg = Object.values(data).flat().join(" ") || "Signup failed.";
                    setApiError(errorMsg);
                }
            } catch (error) {
                setApiError("Network error. Please try again later.");
            }
        }
    };

    return (
        <div className="relative min-h-screen bg-slate-950 flex items-center justify-center">
            <AnimatedBackground />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-md p-8 backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 my-8"
            >
                <h1 className="text-4xl text-white font-bold text-center">
                    Hotel Management
                </h1>

                <p className="text-center text-gray-400 mt-2">
                    Create Account
                </p>

                <form
                    onSubmit={handleSignup}
                    className="space-y-4 mt-6"
                >
                    {apiError && (
                        <div className="p-3 bg-red-500/20 border border-red-500 rounded-xl text-red-500 text-sm text-center">
                            {apiError}
                        </div>
                    )}

                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            className={`w-full p-3 rounded-xl bg-slate-900 text-white outline-none border ${
                                errors.username
                                    ? "border-red-500"
                                    : "border-transparent"
                            }`}
                        />

                        {errors.username && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.username}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="email"
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

                    <div>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            className={`w-full p-3 rounded-xl bg-slate-900 text-white outline-none border ${
                                errors.confirmPassword
                                    ? "border-red-500"
                                    : "border-transparent"
                            }`}
                        />

                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-amber-500 py-3 rounded-xl font-bold hover:bg-amber-400 transition text-slate-900"
                    >
                        Create Account
                    </button>

                    <p className="text-center text-gray-400 mt-4">
                        Already have an account?{" "}
                        <Link
                            to="/"
                            className="text-amber-400 hover:text-amber-300"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}