import { Wrench } from "lucide-react";
import { Link } from "react-router-dom";

export default function OnlineOrder() {
  return (

    
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 p-6 fixed left-0 top-0">
        <h1 className="text-2xl font-bold text-amber-400">
          Restaurant Admin
        </h1>

        <nav className="mt-10 space-y-3">
          <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
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
            <div className="p-3 rounded-xl bg-amber-500 text-black">
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
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">

            <div className="bg-slate-900 p-10 rounded-3xl text-center border border-slate-800 shadow-xl">

                <Wrench
                    size={80}
                    className="mx-auto text-amber-500 mb-5"
                />

                <h1 className="text-4xl font-bold mb-4">
                    Feature Under Development
                </h1>

                <p className="text-slate-400 text-lg">
                    This feature is currently being developed and
                    will be available soon.
                </p>

            </div>

        </div>
      </main>
    </div>
  );
}