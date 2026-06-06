export default function RoleSelector({
    role,
    setRole
}) {
    return (
        <div className="flex bg-slate-800 rounded-xl p-1">
            <button
                type="button"
                onClick={() => setRole("ADMIN")}
                className={`flex-1 py-2 rounded-lg transition-all ${role === "ADMIN"
                    ? "bg-amber-500 text-black font-bold"
                    : "text-white"
                }`}
            >
                Owner
            </button>

            <button
                type="button"
                onClick={() => setRole("WAITER")}
                className={`flex-1 py-2 rounded-lg transition-all ${role === "WAITER"
                    ? "bg-amber-500 text-black font-bold"
                    : "text-white"
                }`}
            >
                Waiter
            </button>
        </div>
    )
}
