import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, UtensilsCrossed } from "lucide-react";
import LogoutButton from "../components/LogoutButton";

export default function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Starter");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fetchMenu = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) return;
            const res = await fetch("http://127.0.0.1:8000/api/restaurant/menu/", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMenuItems(data);
            }
        } catch (e) {
            console.error("Failed to fetch menu");
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !price) {
            setError("Please fill all required fields");
            return;
        }
        if (Number(price) <= 0) {
            setError("Price must be greater than 0");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const token = localStorage.getItem("access_token");
            const url = editingId 
                ? `http://127.0.0.1:8000/api/restaurant/menu/${editingId}/` 
                : "http://127.0.0.1:8000/api/restaurant/menu/";
            
            const method = editingId ? "PUT" : "POST";
            
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, price: Number(price), category, description })
            });
            
            if (res.ok) {
                await fetchMenu();
                setName(""); setPrice(""); setCategory("Starter"); setDescription(""); setEditingId(null);
            } else {
                setError("Failed to save menu item");
            }
        } catch (err) {
            setError("Network error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setName(item.name);
        setCategory(item.category);
        setPrice(item.price);
        setDescription(item.description || "");
        setError("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this item?")) return;
        try {
            const token = localStorage.getItem("access_token");
            await fetch(`http://127.0.0.1:8000/api/restaurant/menu/${id}/`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            setMenuItems(menuItems.filter(item => item.id !== id));
        } catch (e) {
            console.error("Failed to delete", e);
        }
    };

    const filteredItems = [...menuItems]
        .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 p-6 fixed left-0 top-0">
                <h1 className="text-2xl font-bold text-amber-400">Restaurant Admin</h1>
                <nav className="mt-10 space-y-3">
                    <Link to="/admin">
                        <div className="p-3 rounded-xl hover:bg-slate-800">Dashboard</div>
                    </Link>
                    <Link to="/admin/tables">
                        <div className="p-3 rounded-xl hover:bg-slate-800">Manage Tables</div>
                    </Link>
                    <Link to="/admin/employees">
                        <div className="p-3 rounded-xl hover:bg-slate-800">Manage Employees</div>
                    </Link>
                    <div className="p-3 rounded-xl bg-amber-500 text-black">Menu Management</div>
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
                    <UtensilsCrossed size={40} className="text-amber-500" />
                    <h2 className="text-4xl font-bold">Menu Management</h2>
                </div>

                {/* Form */}
                <div className="mt-8 bg-white/5 p-6 rounded-3xl border border-white/10">
                    <h2 className="text-2xl font-semibold mb-5">
                        {editingId ? "Edit Menu Item" : "Add New Menu Item"}
                    </h2>

                    <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Food Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-slate-900 rounded-xl p-3 outline-none border border-transparent focus:border-amber-500"
                        />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-slate-900 rounded-xl p-3 outline-none border border-transparent focus:border-amber-500"
                        >
                            <option>Starter</option>
                            <option>Main Course</option>
                            <option>Dessert</option>
                            <option>Beverage</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Price (₹)"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="bg-slate-900 rounded-xl p-3 outline-none border border-transparent focus:border-amber-500"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Plus size={18} />
                            {editingId ? "Update" : "Add Item"}
                        </button>
                    </form>
                    {error && <p className="text-red-500 mt-3">{error}</p>}
                </div>

                {/* Search */}
                <div className="mt-8">
                    <input
                        type="text"
                        placeholder="Search Menu Item..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-900 rounded-xl p-3 outline-none border border-transparent focus:border-amber-500"
                    />
                </div>

                {/* Table */}
                <div className="mt-8 bg-slate-900 rounded-3xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 bg-black/20">
                                    <th className="p-4 text-center">Food Name</th>
                                    <th className="p-4 text-center">Category</th>
                                    <th className="p-4 text-center">Price</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-slate-500">No items found.</td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item) => (
                                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition text-center">
                                            <td className="p-4 font-medium">{item.name}</td>
                                            <td className="p-4 text-slate-300">{item.category}</td>
                                            <td className="p-4 font-bold text-amber-400">₹{item.price}</td>
                                            <td className="p-4">
                                                <div className="flex justify-center gap-3">
                                                    <button onClick={() => handleEdit(item)} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30">
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}