export default function RoleSelector({
    role,
    setRole
}) {
    return (
        <div className="flex bg-slate-800 rounded-xl p-1">
            <button
                onClick={() => setRole("owner")}
                className={`flex-1 py-2 rounded-lg transition-all ${role === "owner"
                    ? "bg-amber-500 text-black"
                    : "text-white"
                }`}
            >
                Owner
            </button>

            <button
                onClick={() => setRole("employee")}
                className={`flex-1 py-2 rounded-lg transition-all ${role === "employee"
                    ? "bg-amber-500 text-black"
                    : "text-white"
                }`}
            >
                Employee
            </button>
        </div>
    )
}
