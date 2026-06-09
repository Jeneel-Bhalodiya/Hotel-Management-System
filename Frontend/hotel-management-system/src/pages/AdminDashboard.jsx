import { Users, ShoppingBag, IndianRupee, UserStar, Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { chairsTablePlatter } from "@lucide/lab";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const savedTables =
      JSON.parse(localStorage.getItem("tables")) || [];
      setTables(savedTables);
  }, []);

  const cards = [
  {
    title: "Total Tables",
    value: "25",
    icon: <Icon iconNode={ chairsTablePlatter } size={40} />,
  },
  {
    title: "Employees",
    value: "15",
    icon: <Users size={32} />,
  },
  {
    title: "Online Orders",
    value: "48",
    icon: <ShoppingBag size={32} />,
  },
  {
    title: "Revenue",
    value: "₹12,500",
    icon: <IndianRupee size={32} />,
  },
];

  return (

    
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 p-6 fixed left-0 top-0">
        <h1 className="text-2xl font-bold text-amber-400">
          Restaurant Admin
        </h1>

        <nav className="mt-10 space-y-3">
          <div className="p-3 rounded-xl bg-amber-500 text-black">
            Dashboard
          </div>
          <Link to="/admin/tables">
            <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
            
              Manage Tables
            </div>
          </Link>
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

      <main className="ml-64 flex-1 p-8 overflow-y-auto h-screen">
        <div className="flex items-center gap-3">
          <UserStar
            size={40}
            className="text-amber-500" 
          />
          <h2 className="text-4xl font-bold">
            Admin Dashboard
          </h2>
          </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-6"
            >
              <div className="flex justify-between items-center">
                {card.icon}
                <span className="text-3xl font-bold">
                  {card.value}
                </span>
              </div>

              <p className="mt-4 text-slate-300">
                {card.title}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-3xl p-6">
          <h3 className="text-2xl font-bold mb-6">
            Restaurant Tables
          </h3>

          {tables.length === 0 ? (
            <div className="text-slate-400 text-center py-10">
              No tables added yet
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className="bg-slate-900 rounded-2xl p-5 border border-slate-700 hover:border-amber-500 transition"
                >
                  <div className="flex justify-center mb-3">
                    <Icon
                      iconNode={chairsTablePlatter}
                      size={40}
                      className="text-amber-500"
                    />
                  </div>

                  <h4 className="text-center text-xl font-bold">
                    Table {table.tableNo}
                  </h4>

                  <p className="text-center text-slate-400 mt-2">
                    Capacity: {table.capacity}
                  </p>

                  <div className="mt-4">
                    <span className="w-full block text-center bg-green-500/20 text-green-400 py-2 rounded-lg">
                      Available
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}