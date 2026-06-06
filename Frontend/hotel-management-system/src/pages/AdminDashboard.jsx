import { Heater, Users, ShoppingBag, IndianRupee, UserStar, Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { chairsTablePlatter } from "@lucide/lab";

export default function AdminDashboard() {
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
          <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
            Online Orders
          </div>

          <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
            Reports
          </div>
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

        <div className="mt-8  rounded-3xl p-6">
          
        </div>
      </main>
    </div>
  );
}