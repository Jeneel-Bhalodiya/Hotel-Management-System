import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    Pencil,
    Plus,
    Trash2,
    Users,
} from "lucide-react";
import LogoutButton from "../components/LogoutButton";

export default function Employees() {

    const [employees, setEmployees] = useState([]);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [salary, setSalary] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://127.0.0.1:8000/api/auth/employees/", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setEmployees(data);
            }
        } catch (error) {
            console.error("Failed to fetch employees", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !salary || (!editingId && !password)) {
            setError("Please fill all fields");
            return;
        }

        if (Number(salary) <= 0) {
            setError("Salary must be greater than 0");
            return;
        }

        setError("");
        setIsLoading(true);


        try {
            const token = localStorage.getItem("access_token");

            const url = editingId
                ? `http://127.0.0.1:8000/api/auth/employees/${editingId}/`
                : "http://127.0.0.1:8000/api/auth/employees/";

            const method = editingId ? "PATCH" : "POST";

            const body = editingId
                ? {
                    name,
                    salary: Number(salary),
                }
                : {
                    name,
                    password,
                    salary: Number(salary),
                };

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                await fetchEmployees();

                setEditingId(null);
                setName("");
                setPassword("");
                setSalary("");
            } else {
                const data = await response.json();
                setError(
                    Object.values(data).flat().join(" ") ||
                    `Failed to ${editingId ? "update" : "add"} employee`
                );
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (emp) => {
        setEditingId(emp.id);
        setName(emp.name);
        setSalary(emp.salary);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;
        
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`http://127.0.0.1:8000/api/auth/employees/${id}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                setEmployees(employees.filter((emp) => emp.id !== id));
            } else {
                alert("Failed to delete employee");
            }
        } catch (error) {
            console.error("Failed to delete employee", error);
        }
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
                    <Link to="/admin/tables">
                        <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
                            Manage Tables
                        </div>
                    </Link>
                    <div className="p-3 rounded-xl bg-amber-500 text-black">
                        Manage Employees
                    </div>
                    <Link to="/admin/menu">
                        <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
                            Manage Menu
                        </div>
                    </Link>
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
                <div className="absolute bottom-6 left-6 right-6">
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8 overflow-y-auto h-screen">

                <div className="flex items-center gap-3">
                    <Users size={40} className="text-amber-500" />
                    <h2 className="text-4xl font-bold">
                        Employee Management
                    </h2>
                </div>

                {/* Form */}
                <div className="mt-8 bg-white/5 p-6 rounded-3xl border border-white/10">
                    <h2 className="text-2xl font-semibold mb-5">
                        {editingId ? "Edit Employee" : "Add New Employee"}
                    </h2>

                    <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Employee Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-slate-900 rounded-xl p-3 outline-none w-full border border-transparent focus:border-amber-500"
                            />
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        </div>

                        {!editingId && (
                            <input
                                type="text"
                                placeholder="Set Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-slate-900 rounded-xl p-3 outline-none border border-transparent focus:border-amber-500"
                            />
                        )}

                        <input
                            type="number"
                            placeholder="Salary (₹)"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            className="bg-slate-900 rounded-xl p-3 outline-none border border-transparent focus:border-amber-500"
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl p-3 flex justify-center items-center gap-2 disabled:opacity-50"
                        >
                            <Plus size={18} />
                            {isLoading
                                ? editingId
                                ? "Updating..."
                                : "Adding..."
                                : editingId
                                ? "Update Employee"
                                : "Add Employee"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);
                                    setName("");
                                    setPassword("");
                                    setSalary("");
                                }}
                                className="bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl p-3"
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>

                {/* Employee Table */}
                <div className="mt-8 bg-slate-900 rounded-3xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-xl font-bold">Current Staff</h3>
                        <p className="text-sm text-slate-400 mt-1">Share the generated Login ID and password with your employees.</p>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 bg-black/20">
                                    <th className="p-4 font-medium pl-6">Name</th>
                                    <th className="p-4 font-medium">Login ID (Username)</th>
                                    <th className="p-4 font-medium">Salary</th>
                                    <th className="p-4 font-medium text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-slate-500">
                                            No employees found. Add your first employee above.
                                        </td>
                                    </tr>
                                ) : (
                                    [...employees].sort((a, b) => a.name.localeCompare(b.name)).map((employee) => (
                                        <tr key={employee.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                            <td className="p-4 pl-6 font-medium">{employee.name}</td>
                                            <td className="p-4">
                                                <code className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded">
                                                    {employee.username}
                                                </code>
                                            </td>
                                            <td className="p-4">₹{employee.salary}</td>
                                            <td className="p-4">
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => handleEdit(employee)}
                                                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                                                        title="Delete Employee"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(employee.id)}
                                                        className="p-2 text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition"
                                                        title="Delete Employee"
                                                    >
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