import { Users, ShoppingBag, IndianRupee, UserStar, Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { chairsTablePlatter } from "@lucide/lab";
import { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";

export default function AdminDashboard() {
  const [tables, setTables] = useState([]);
  const [hotelSettings, setHotelSettings] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      
      const headers = { "Authorization": `Bearer ${token}` };

      const [hotelRes, tablesRes, ordersRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/auth/hotel-setup/", { headers }),
        fetch("http://127.0.0.1:8000/api/restaurant/tables/", { headers }),
        fetch("http://127.0.0.1:8000/api/restaurant/orders/", { headers })
      ]);

      if (hotelRes.ok) setHotelSettings(await hotelRes.json());
      if (tablesRes.ok) setTables(await tablesRes.json());
      if (ordersRes.ok) setActiveOrders(await ordersRes.json());
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckout = async (tableId) => {
    if (!window.confirm("Confirm checkout and clear table?")) return;
    setIsCheckingOut(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://127.0.0.1:8000/api/restaurant/checkout/${tableId}/`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        setSelectedTable(null);
        await fetchData();
      } else {
        alert("Failed to checkout");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const cards = [
    {
      title: "Total Tables",
      value: hotelSettings ? hotelSettings.total_tables : "0",
      icon: <Icon iconNode={chairsTablePlatter} size={40} />,
    },
    {
      title: "Employees",
      value: hotelSettings ? hotelSettings.total_employees : "0",
      icon: <Users size={32} />,
    },
    {
      title: "Active Orders",
      value: activeOrders.length.toString(),
      icon: <ShoppingBag size={32} />,
    },
    {
      title: "Active Revenue",
      value: `₹${activeOrders.reduce((sum, order) => sum + Number(order.total_amount), 0)}`,
      icon: <IndianRupee size={32} />,
    },
  ];

  const activeSelectedTable = tables.find(t => t.id === selectedTable?.id) || selectedTable;
  const currentOrder = activeSelectedTable 
    ? activeOrders.find(o => o.table === activeSelectedTable.id) 
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 p-6 fixed left-0 top-0">
        <h1 className="text-2xl font-bold text-amber-400">Restaurant Admin</h1>
        <nav className="mt-10 space-y-3">
          <div className="p-3 rounded-xl bg-amber-500 text-black">Dashboard</div>
          <Link to="/admin/tables">
            <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">Manage Tables</div>
          </Link>
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

      <main className="ml-64 flex-1 p-8 overflow-y-auto h-screen">
        <div className="flex items-center gap-3">
          <UserStar size={40} className="text-amber-500" />
          <h2 className="text-4xl font-bold">Admin Dashboard</h2>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
          {cards.map((card) => (
            <div key={card.title} className="bg-white/10 backdrop-blur-xl rounded-3xl p-6">
              <div className="flex justify-between items-center">
                {card.icon}
                <span className="text-3xl font-bold">{card.value}</span>
              </div>
              <p className="mt-4 text-slate-300">{card.title}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Tables List */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-3xl p-6">
            <h3 className="text-2xl font-bold mb-6">Restaurant Tables</h3>
            {tables.length === 0 ? (
              <div className="text-slate-400 text-center py-10">
                No tables fetched. (Have you run migrations?)
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    onClick={() => setSelectedTable(table)}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition ${
                      selectedTable?.id === table.id ? "border-amber-500" : "border-slate-700 hover:border-slate-500"
                    } ${table.is_occupied ? "bg-red-500/20" : "bg-green-500/10"}`}
                  >
                    <div className="flex justify-center mb-3">
                      <Icon iconNode={chairsTablePlatter} size={40} className={table.is_occupied ? "text-red-400" : "text-green-400"} />
                    </div>
                    <h4 className="text-center text-xl font-bold">Table {table.table_number}</h4>
                    <p className="text-center text-slate-400 mt-2">Capacity: {table.capacity}</p>
                    <div className="mt-4">
                      <span className={`w-full block text-center py-2 rounded-lg ${
                        table.is_occupied ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                      }`}>
                        {table.is_occupied ? "Occupied" : "Available"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Table Details & Checkout */}
          <div>
            {activeSelectedTable ? (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sticky top-8">
                <h3 className="text-2xl font-bold text-amber-400">Table {activeSelectedTable.table_number}</h3>
                <p className="text-slate-400 mt-1 mb-6">Capacity: {activeSelectedTable.capacity} Persons</p>

                {activeSelectedTable.is_occupied && currentOrder ? (
                  <div>
                    <h4 className="text-xl font-bold mb-4">Active Bill</h4>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 mb-6">
                      {currentOrder.items.map((item) => (
                        <div key={item.id} className="bg-slate-900 p-3 rounded-xl flex justify-between items-center border border-white/5">
                          <div>
                            <p className="font-bold">{item.menu_item_name}</p>
                            <p className="text-sm text-slate-400">Qty: {item.quantity} × ₹{item.price_at_time}</p>
                          </div>
                          <p className="font-bold">₹{item.quantity * item.price_at_time}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-300">Served By:</span>
                        <span className="font-bold">{currentOrder.waiter_name || "Unknown"}</span>
                      </div>
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-xl text-slate-300">Total Amount:</span>
                        <span className="text-3xl font-bold text-green-400">₹{currentOrder.total_amount}</span>
                      </div>
                      
                      <button
                        onClick={() => handleCheckout(activeSelectedTable.id)}
                        disabled={isCheckingOut}
                        className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl text-lg transition disabled:opacity-50"
                      >
                        {isCheckingOut ? "Processing..." : "Receive Payment & Clear Table"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-4">
                      <Icon iconNode={chairsTablePlatter} size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-300">Table is Available</h4>
                    <p className="text-slate-500 mt-2">Waiters can assign customers to this table from their dashboard.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center text-slate-400 h-full flex flex-col items-center justify-center">
                <Icon iconNode={chairsTablePlatter} size={48} className="text-slate-600 mb-4" />
                <p>Select a table to view its current bill and perform checkout.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}