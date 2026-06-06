import { Link } from "react-router-dom";
import { useState } from "react";
import { Plus, Pencil, Trash2, Icon } from "lucide-react";
import { chairsTablePlatter } from "@lucide/lab";

export default function Tables() {
    const [tables, setTables] = useState([
        {
            id: 1,
            tableNo: 1,
            capacity: 4,
        },
        {
            id: 2,
            tableNo: 2,
            capacity: 6,
        },
    ]);

    const [tableNo, setTableNo] = useState("");
    const [capacity, setCapacity] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!tableNo || !capacity) {
            setError("Please fill all fields");
            return;
        }

        if (Number(capacity) <= 0) {
            setError(
                "Capacity must be greater than 0"
            );
            return;
        }

        const duplicateTable = tables.find(
            (table) =>
                Number(table.tableNo) ===
                    Number(tableNo) &&
                table.id !== editingId
        );

        if (duplicateTable) {
            setError(
                "Table number already exists"
            );
            return;
        }

        setError("");

        if (editingId) {
            const updatedTables = tables.map(
                (table) =>
                    table.id === editingId
                        ? {
                              ...table,
                              tableNo:
                                  Number(tableNo),
                              capacity:
                                  Number(capacity),
                          }
                        : table
            );

            setTables(
                updatedTables.sort(
                    (a, b) =>
                        a.tableNo - b.tableNo
                )
            );

            setEditingId(null);
        } else {
            const newTable = {
                id: Date.now(),
                tableNo: Number(tableNo),
                capacity: Number(capacity),
            };

            setTables(
                [...tables, newTable].sort(
                    (a, b) =>
                        a.tableNo - b.tableNo
                )
            );
        }

        setTableNo("");
        setCapacity("");
    };

    const handleEdit = (table) => {
        setEditingId(table.id);
        setTableNo(table.tableNo);
        setCapacity(table.capacity);
        setError("");
    };

    const handleDelete = (id) => {
        setTables(
            tables.filter(
                (table) => table.id !== id
            )
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">

            {/* Sidebar */}
            <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 p-6 fixed left-0 top-0">
                <h1 className="text-2xl font-bold text-amber-400">
                    Restaurant Admin
                </h1>

                <nav className="mt-10 space-y-3">

                    <Link to="/admin">
                        <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
                            Dashboard
                        </div>
                    </Link>

                    <div className="p-3 rounded-xl bg-amber-500 text-black">
                        Manage Tables
                    </div>

                    <Link to="/admin/employees">
                        <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
                            Manage Employees
                        </div>
                    </Link>

                    <Link to="/admin/menu">
                        <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
                            Manage Menu
                        </div>
                    </Link>

                    <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
                        Online Orders
                    </div>

                    <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
                        Reports
                    </div>

                </nav>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8 overflow-y-auto h-screen">

                <div className="flex items-center gap-3">
                    <Icon
                        iconNode={
                            chairsTablePlatter
                        }
                        size={40}
                        className="text-amber-500"
                    />

                    <h2 className="text-4xl font-bold">
                        Table Management
                    </h2>
                </div>

                {/* Form */}
                <div className="mt-8">

                    <h2 className="text-2xl font-semibold mb-5">
                        {editingId
                            ? "Edit Table"
                            : "Add New Table"}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid md:grid-cols-3 gap-6"
                    >

                        <div>
                            <input
                                type="number"
                                placeholder="Table Number"
                                value={tableNo}
                                onChange={(e) =>
                                    setTableNo(
                                        e.target.value
                                    )
                                }
                                className="bg-slate-900 rounded-xl p-3 outline-none w-full"
                            />

                            {error && (
                                <p className="text-red-500 text-sm mt-2">
                                    {error}
                                </p>
                            )}
                        </div>

                        <input
                            type="number"
                            placeholder="Capacity (Persons)"
                            value={capacity}
                            onChange={(e) =>
                                setCapacity(
                                    e.target.value
                                )
                            }
                            className="bg-slate-900 rounded-xl p-3 outline-none"
                        />

                        <button
                            type="submit"
                            className="bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl p-3 flex justify-center items-center gap-2"
                        >
                            <Plus size={18} />

                            {editingId
                                ? "Update Table"
                                : "Add Table"}
                        </button>

                    </form>
                </div>

                {/* Table List */}
                <div className="mt-8 overflow-x-auto">

                    <table className="w-full">

                        <thead>
                            <tr className="border-b border-white/10 text-slate-400">

                                <th className="p-4 text-center">
                                    Table Number
                                </th>

                                <th className="p-4 text-center">
                                    Capacity
                                </th>

                                <th className="p-4 text-center">
                                    Actions
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {[...tables]
                                .sort(
                                    (a, b) =>
                                        a.tableNo -
                                        b.tableNo
                                )
                                .map((table) => (
                                    <tr
                                        key={
                                            table.id
                                        }
                                        className="border-b border-white/5 hover:bg-white/5 transition text-center"
                                    >

                                        <td className="p-4">
                                            Table{" "}
                                            {
                                                table.tableNo
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                table.capacity
                                            }{" "}
                                            Persons
                                        </td>

                                        <td className="p-4">
                                            <div className="flex justify-center gap-3">

                                                <button
                                                    onClick={() =>
                                                        handleEdit(
                                                            table
                                                        )
                                                    }
                                                    className="p-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30"
                                                >
                                                    <Pencil
                                                        size={
                                                            18
                                                        }
                                                    />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            table.id
                                                        )
                                                    }
                                                    className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30"
                                                >
                                                    <Trash2
                                                        size={
                                                            18
                                                        }
                                                    />
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