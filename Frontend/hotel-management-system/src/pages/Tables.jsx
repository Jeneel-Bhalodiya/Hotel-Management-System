import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Icon } from "lucide-react";
import { chairsTablePlatter } from "@lucide/lab";
import LogoutButton from "../components/LogoutButton";

export default function Tables() {
    const [tables, setTables] = useState([]);
    const [tableNumber, setTableNumber] = useState("")
    const [capacity, setCapacity] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    const fetchTables = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) return;
            const res = await fetch("http://127.0.0.1:8000/api/restaurant/tables/", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) setTables(await res.json());
        } catch (e) {
            console.error("Failed to fetch tables");
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!capacity || Number(capacity) <= 0) {
            setError("Capacity must be greater than 0");
            return;
        }
        setError("");

        if (editingId) {
            try {
                const token = localStorage.getItem("access_token");
                const res = await fetch(`http://127.0.0.1:8000/api/restaurant/tables/${editingId}/`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ capacity: Number(capacity) })
                });

                if (res.ok) {
                    await fetchTables();
                    setEditingId(null);
                    setCapacity("");
                } else {
                    setError("Failed to update table capacity");
                }
            } catch (err) {
                setError("Network error");
            }
        }
    };

    const handleEdit = (table) => {
        setEditingId(table.id);
        setTableNumber(table.table_number);
        setCapacity(table.capacity);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this table?")) return;
        
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`http://127.0.0.1:8000/api/auth/tables/${id}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                setTables(tables.filter((tables) => table.id !== id));
            } else {
                alert("Failed to delete table");
            }
        } catch (error) {
            console.error("Failed to delete table", error);
        }
    };

    

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 p-6 fixed left-0 top-0">
                <h1 className="text-2xl font-bold text-amber-400">Restaurant Admin</h1>
                <nav className="mt-10 space-y-3">
                    <Link to="/admin">
                        <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">Dashboard</div>
                    </Link>
                    <div className="p-3 rounded-xl bg-amber-500 text-black">Manage Tables</div>
                    <Link to="/admin/employees">
                        <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">Manage Employees</div>
                    </Link>
                    <Link to="/admin/menu">
                        <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">Manage Menu</div>
                    </Link>
                    <Link to="/admin/orders">
                        <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">Online Orders</div>
                    </Link>
                    <Link to="/admin/reports">
                        <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">Reports</div>
                    </Link>
                </nav>
                <div className="absolute bottom-6 left-6 right-6">
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8 overflow-y-auto h-screen">
                <div className="flex items-center gap-3">
                    <Icon iconNode={chairsTablePlatter} size={40} className="text-amber-500" />
                    <h2 className="text-4xl font-bold">Table Management</h2>
                </div>

                {/* Form */}
                <div className="mt-8 bg-white/10 p-6 rounded-3xl">
                    <h2 className="text-2xl font-semibold mb-5">
                        {editingId ? "Edit Table" : "Add Table"}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Table Number */}
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">
                                    Table Number
                                </label>

                                <input
                                    type="number"
                                    value={tableNumber}
                                    onChange={(e) => setTableNumber(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-amber-500"
                                    placeholder="Enter Table Number"
                                />
                            </div>

                            {/* Capacity */}
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">
                                    Capacity
                                </label>

                                <input
                                    type="number"
                                    value={capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-amber-500"
                                    placeholder="Enter Capacity"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                type="submit"
                                className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl"
                            >
                                {editingId ? "Update Table" : "Add Table"}
                            </button>
                            <div className="flex gap-4 mt-6">
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingId(null);
                                            setTableNumber("");
                                            setCapacity("");
                                        }}
                                        className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>              

                {/* Table List */}
                <div className="mt-8 bg-slate-900 rounded-3xl overflow-hidden border border-slate-800">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold">
                                All Tables
                            </h3>

                            <p className="text-slate-400 text-sm mt-1">
                                Tables are automatically created based on your Hotel Setup.
                                You can update their seating capacity here.
                            </p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 bg-black/20">
                                    <th className="p-4 text-center">Table Number</th>
                                    <th className="p-4 text-center">Capacity</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...tables].sort((a, b) => a.table_number - b.table_number).map((table) => (
                                    <tr key={table.id} className="border-b border-white/5 hover:bg-white/5 transition text-center">
                                        <td className="p-4 font-bold text-amber-400">Table {table.table_number}</td>
                                        <td className="p-4">{table.capacity} Persons</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-sm ${
                                                table.is_occupied ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                                            }`}>
                                                {table.is_occupied ? "Occupied" : "Available"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => handleEdit(table)}
                                                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(table)}
                                                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {tables.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center p-8 text-slate-500">
                                            No tables found. (Have you run migrations?)
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}