import { Link } from "react-router-dom";
import { useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    UtensilsCrossed,
} from "lucide-react";

export default function Menu() {
    const [menuItems, setMenuItems] = useState([
        {
            id: 1,
            name: "Gujarati Thali",
            category: "Main Course",
            price: 250,
            status: "Available",
        },
        {
            id: 2,
            name: "Paneer Tikka",
            category: "Starter",
            price: 180,
            status: "Available",
        },
    ]);

    const [name, setName] = useState("");
    const [category, setCategory] = useState("Starter");
    const [price, setPrice] = useState("");
    const [status, setStatus] = useState("Available");
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !price) {
            setError("Please fill all fields");
            return;
        }

        if (Number(price) <= 0) {
            setError("Price must be greater than 0");
            return;
        }

        const duplicateItem = menuItems.find(
            (item) =>
                item.name.toLowerCase().trim() ===
                    name.toLowerCase().trim() &&
                item.id !== editingId
        );

        if (duplicateItem) {
            setError("Food item already exists");
            return;
        }

        setError("");

        if (editingId) {
            const updatedItems = menuItems.map(
                (item) =>
                    item.id === editingId
                        ? {
                              ...item,
                              name,
                              category,
                              price: Number(price),
                              status,
                          }
                        : item
            );

            setMenuItems(
                updatedItems.sort((a, b) =>
                    a.name.localeCompare(b.name)
                )
            );

            setEditingId(null);
        } else {
            const newItem = {
                id: Date.now(),
                name,
                category,
                price: Number(price),
                status,
            };

            setMenuItems(
                [...menuItems, newItem].sort((a, b) =>
                    a.name.localeCompare(b.name)
                )
            );
        }

        setName("");
        setCategory("Starter");
        setPrice("");
        setStatus("Available");
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setName(item.name);
        setCategory(item.category);
        setPrice(item.price);
        setStatus(item.status);
        setError("");
    };

    const handleDelete = (id) => {
        setMenuItems(
            menuItems.filter(
                (item) => item.id !== id
            )
        );
    };

    const filteredItems = [...menuItems]
        .filter((item) =>
            item.name
                .toLowerCase()
                .includes(search.toLowerCase())
        )
        .sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">

            {/* Sidebar */}
            <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 p-6 fixed left-0 top-0">

                <h1 className="text-2xl font-bold text-amber-400">
                    Restaurant Admin
                </h1>

                <nav className="mt-10 space-y-3">

                    <Link to="/admin">
                        <div className="p-3 rounded-xl hover:bg-slate-800">
                            Dashboard
                        </div>
                    </Link>

                    <Link to="/admin/tables">
                        <div className="p-3 rounded-xl hover:bg-slate-800">
                            Manage Tables
                        </div>
                    </Link>

                    <Link to="/admin/employees">
                        <div className="p-3 rounded-xl hover:bg-slate-800">
                            Manage Employees
                        </div>
                    </Link>

                    <div className="p-3 rounded-xl bg-amber-500 text-black">
                        Menu Management
                    </div>

                    <Link to="/admin/orders">
                        <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
                            Online Orders
                        </div>
                    </Link>
                    
                    <Link to="/admin/reports">
                        <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
                            Reports
                        </div>
                    </Link>

                </nav>

            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8 overflow-y-auto h-screen">

                <div className="flex items-center gap-3">
                    <UtensilsCrossed
                        size={40}
                        className="text-amber-500"
                    />

                    <h2 className="text-4xl font-bold">
                        Menu Management
                    </h2>
                </div>

                {/* Form */}
                <div className="mt-8">

                    <h2 className="text-2xl font-semibold mb-5">
                        {editingId
                            ? "Edit Menu Item"
                            : "Add New Menu Item"}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid md:grid-cols-5 gap-4"
                    >

                        <input
                            type="text"
                            placeholder="Food Name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            className="bg-slate-900 rounded-xl p-3 outline-none"
                        />

                        <select
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value)
                            }
                            className="bg-slate-900 rounded-xl p-3 outline-none"
                        >
                            <option>Starter</option>
                            <option>Main Course</option>
                            <option>Dessert</option>
                            <option>Beverage</option>
                        </select>

                        <input
                            type="number"
                            placeholder="Price"
                            value={price}
                            onChange={(e) =>
                                setPrice(e.target.value)
                            }
                            className="bg-slate-900 rounded-xl p-3 outline-none"
                        />

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                            className="bg-slate-900 rounded-xl p-3 outline-none"
                        >
                            <option>Available</option>
                            <option>Out Of Stock</option>
                        </select>

                        <button
                            type="submit"
                            className="bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl flex items-center justify-center gap-2"
                        >
                            <Plus size={18} />
                            {editingId
                                ? "Update"
                                : "Add Item"}
                        </button>

                    </form>

                    {error && (
                        <p className="text-red-500 mt-3">
                            {error}
                        </p>
                    )}
                </div>

                {/* Search */}
                <div className="mt-8">
                    <input
                        type="text"
                        placeholder="Search Menu Item..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="w-full bg-slate-900 rounded-xl p-3 outline-none"
                    />
                </div>

                {/* Table */}
                <div className="mt-8 overflow-x-auto">

                    <table className="w-full">

                        <thead>
                            <tr className="border-b border-white/10 text-slate-400">
                                <th className="p-4 text-center">
                                    Food Name
                                </th>

                                <th className="p-4 text-center">
                                    Category
                                </th>

                                <th className="p-4 text-center">
                                    Price
                                </th>

                                <th className="p-4 text-center">
                                    Status
                                </th>

                                <th className="p-4 text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredItems.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-white/5 hover:bg-white/5 transition text-center"
                                >

                                    <td className="p-4">
                                        {item.name}
                                    </td>

                                    <td className="p-4">
                                        {item.category}
                                    </td>

                                    <td className="p-4">
                                        ₹{item.price}
                                    </td>

                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                item.status ===
                                                "Available"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-red-500/20 text-red-400"
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex justify-center gap-3">

                                            <button
                                                onClick={() =>
                                                    handleEdit(item)
                                                }
                                                className="p-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30"
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30"
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                        </div>
                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>

            </main>

        </div>
    );
}