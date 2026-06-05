import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import { motion } from "framer-motion";

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/");
            return;
        }
        setUser(JSON.parse(storedUser));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/");
    };

    if (!user) return null;

    return (
        <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <AnimatedBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="z-10 w-full max-w-2xl p-8 backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl text-white font-bold">
                        Dashboard
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl transition font-medium border border-red-500/30"
                    >
                        Logout
                    </button>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center space-y-4">
                    <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center text-4xl font-bold text-slate-900 mb-2">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-1">
                            Welcome, {user.username}!
                        </h2>
                        <div className="inline-block bg-amber-500/20 border border-amber-500/50 text-amber-400 px-3 py-1 rounded-full text-sm font-bold tracking-wider uppercase mt-2">
                            {user.role}
                        </div>
                    </div>
                    
                    {user.email && (
                        <p className="text-gray-400 mt-2">
                            {user.email}
                        </p>
                    )}
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.role === 'ADMIN' && (
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition cursor-pointer">
                            <h3 className="text-amber-400 font-bold mb-2">Manage Users</h3>
                            <p className="text-sm text-gray-400">Add, remove, or modify waitstaff and admin accounts.</p>
                        </div>
                    )}
                    
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition cursor-pointer">
                        <h3 className="text-amber-400 font-bold mb-2">View Orders</h3>
                        <p className="text-sm text-gray-400">Access current and past orders in the system.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
