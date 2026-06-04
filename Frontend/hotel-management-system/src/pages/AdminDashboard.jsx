import { Heater, Users, ShoppingBag, IndianRupee } from "lucide-react";

export default function AdminDashboard() {
  const cards = [
  {
    title: "Total Tables",
    value: "25",
    icon: <Heater size={32} />,
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
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6">
        <h1 className="text-2xl font-bold text-amber-400">
          Hotel Admin
        </h1>

        <nav className="mt-10 space-y-3">
          <div className="p-3 rounded-xl bg-amber-500 text-black">
            Dashboard
          </div>

          <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
            Tables
          </div>

          <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
            Employees
          </div>

          <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
            Online Orders
          </div>

          <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
            Reports
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h2 className="text-4xl font-bold">
          Admin Dashboard
        </h2>

        <p className="text-slate-400 mt-2">
          Welcome back Admin
        </p>

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

        <div className="mt-8 bg-white/10 rounded-3xl p-6">
          <h3 className="text-2xl font-semibold mb-4">
            Recent Bookings
          </h3>

          <table className="w-full">
            <thead>
              <tr className="text-left text-slate-400">
                <th>Table Number</th>
                <th>Capacity(Person)</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>John</td>
                <td>201</td>
                <td>Checked In</td>
              </tr>

              <tr>
                <td>Sarah</td>
                <td>305</td>
                <td>Pending</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}