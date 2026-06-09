import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const refresh_token = localStorage.getItem("refresh_token");
            if (token && refresh_token) {
                await fetch("http://127.0.0.1:8000/api/auth/logout/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ refresh_token })
                });
            }
        } catch (e) {
            console.error("Logout failed", e);
        } finally {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            navigate("/login");
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full mt-auto p-3 rounded-xl hover:bg-red-500/20 text-red-500 flex items-center justify-center gap-2 transition font-bold"
        >
            <LogOut size={20} />
            Logout
        </button>
    );
}
