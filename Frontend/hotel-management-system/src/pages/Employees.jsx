import { Link } from "react-router-dom";
import { useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Users,
} from "lucide-react";

export default function Employees() {

    const [employees, setEmployees] = useState([
        {
            id: 1,
            name: "Rahul Patel",
            salary: 25000,
        },
        {
            id: 2,
            name: "Priya Shah",
            salary: 30000,
        },
    ]);

    const [name, setName] = useState("");
    const [salary, setSalary] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !salary) {
            setError("Please fill all fields");
            return;
        }

        if (Number(salary) <= 0) {
            setError(
                "Salary must be greater than 0"
            );
            return;
        }

        const duplicateEmployee =
            employees.find(
                (employee) =>
                    employee.name
                        .toLowerCase()
                        .trim() ===
                        name.toLowerCase().trim() &&
                    employee.id !== editingId
            );

        if (duplicateEmployee) {
            setError(
                "Employee already exists"
            );
            return;
        }

        setError("");

        if (editingId) {
            const updatedEmployees =
                employees.map((employee) =>
                    employee.id === editingId
                        ? {
                              ...employee,
                              name,
                              salary: Number(
                                  salary
                              ),
                          }
                        : employee
                );

            setEmployees(
                updatedEmployees.sort(
                    (a, b) =>
                        a.name.localeCompare(
                            b.name
                        )
                )
            );

            setEditingId(null);
        } else {
            const newEmployee = {
                id: Date.now(),
                name,
                salary: Number(salary),
            };

            setEmployees(
                [
                    ...employees,
                    newEmployee,
                ].sort((a, b) =>
                    a.name.localeCompare(
                        b.name
                    )
                )
            );
        }

        setName("");
        setSalary("");
    };

    const handleEdit = (employee) => {
        setEditingId(employee.id);
        setName(employee.name);
        setSalary(employee.salary);
        setError("");
    };

    const handleDelete = (id) => {
        setEmployees(
            employees.filter(
                (employee) =>
                    employee.id !== id
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

            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8 overflow-y-auto h-screen">

                <div className="flex items-center gap-3">

                    <Users
                        size={40}
                        className="text-amber-500"
                    />

                    <h2 className="text-4xl font-bold">
                        Employee Management
                    </h2>

                </div>

                {/* Form */}
                <div className="mt-8">

                    <h2 className="text-2xl font-semibold mb-5">
                        {editingId
                            ? "Edit Employee"
                            : "Add New Employee"}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid md:grid-cols-3 gap-6"
                    >

                        <div>
                            <input
                                type="text"
                                placeholder="Employee Name"
                                value={name}
                                onChange={(e) =>
                                    setName(
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
                            placeholder="Salary"
                            value={salary}
                            onChange={(e) =>
                                setSalary(
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
                                ? "Update Employee"
                                : "Add Employee"}
                        </button>

                    </form>

                </div>

                {/* Employee Table */}
                <div className="mt-8 overflow-x-auto">

                    <table className="w-full">

                        <thead>
                            <tr className="border-b border-white/10 text-slate-400">

                                <th className="p-4 text-center">
                                    Employee Name
                                </th>

                                <th className="p-4 text-center">
                                    Salary
                                </th>

                                <th className="p-4 text-center">
                                    Actions
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {[...employees]
                                .sort((a, b) =>
                                    a.name.localeCompare(
                                        b.name
                                    )
                                )
                                .map((employee) => (
                                    <tr
                                        key={
                                            employee.id
                                        }
                                        className="border-b border-white/5 hover:bg-white/5 transition text-center"
                                    >

                                        <td className="p-4">
                                            {
                                                employee.name
                                            }
                                        </td>

                                        <td className="p-4">
                                            ₹
                                            {
                                                employee.salary
                                            }
                                        </td>

                                        <td className="p-4">
                                            <div className="flex justify-center gap-3">

                                                <button
                                                    onClick={() =>
                                                        handleEdit(
                                                            employee
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
                                                            employee.id
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