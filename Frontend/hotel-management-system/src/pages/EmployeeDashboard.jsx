import { useEffect, useState } from "react";
import { ClipboardList, CheckCircle, Users } from "lucide-react";
import LogoutButton from "../components/LogoutButton";

export default function EmployeeDashboard() {
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [activeTable, setActiveTable] = useState(null);

  const [selectedFood, setSelectedFood] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      const headers = { "Authorization": `Bearer ${token}` };

      const [tablesRes, menuRes, ordersRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/restaurant/tables/", { headers }),
        fetch("http://127.0.0.1:8000/api/restaurant/menu/", { headers }),
        fetch("http://127.0.0.1:8000/api/restaurant/orders/", { headers })
      ]);

      if (tablesRes.ok) setTables(await tablesRes.json());
      if (menuRes.ok) setMenuItems(await menuRes.json());
      if (ordersRes.ok) setActiveOrders(await ordersRes.json());
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 5 seconds to keep dashboard live
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const addOrder = async (e) => {
    e.preventDefault();
    if (!activeTable || !selectedFood || quantity < 1) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://127.0.0.1:8000/api/restaurant/add-to-order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          table_id: activeTable.id,
          menu_item_id: selectedFood,
          quantity: Number(quantity)
        })
      });

      if (response.ok) {
        setSelectedFood("");
        setQuantity(1);
        await fetchData(); // Refresh tables and orders
      } else {
        alert("Failed to add order");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeOrderItem = async (itemId) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://127.0.0.1:8000/api/restaurant/remove-order-item/${itemId}/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  const occupiedTables = tables.filter((t) => t.is_occupied).length;
  const availableTables = tables.length - occupiedTables;
  
  const activeSelectedTable = tables.find(t => t.id === activeTable?.id) || activeTable;
  const currentOrder = activeSelectedTable 
    ? activeOrders.find(o => o.table === activeSelectedTable.id) 
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={40} className="text-amber-500" />
          <h2 className="text-4xl font-bold">Employee Dashboard</h2>
        </div>
        <div className="w-32">
          <LogoutButton />
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid md:grid-cols-4 gap-6 py-8">
        <div className="bg-white/10 p-6 rounded-3xl">
          <h3 className="mt-3 text-lg">Total Tables</h3>
          <p className="text-3xl font-bold">{tables.length}</p>
        </div>
        <div className="bg-white/10 p-6 rounded-3xl border border-red-500/30">
          <CheckCircle size={32} className="text-red-400" />
          <h3 className="mt-3 text-lg">Occupied</h3>
          <p className="text-3xl font-bold text-red-400">{occupiedTables}</p>
        </div>
        <div className="bg-white/10 p-6 rounded-3xl border border-green-500/30">
          <h3 className="mt-3 text-lg">Available</h3>
          <p className="text-3xl font-bold text-green-400">{availableTables}</p>
        </div>
        <div className="bg-white/10 p-6 rounded-3xl">
          <ClipboardList size={32} />
          <h3 className="mt-3 text-lg">Active Orders</h3>
          <p className="text-3xl font-bold">{activeOrders.length}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Tables Grid */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-5">Restaurant Tables</h2>
          {tables.length === 0 ? (
            <div className="p-8 bg-white/5 rounded-3xl text-center text-slate-400">
              No tables configured by Admin yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-5">
              {tables.map((table) => (
                <div
                  key={table.id}
                  onClick={() => setActiveTable(table)}
                  className={`cursor-pointer p-5 rounded-2xl border-2 transition-all hover:scale-105 ${
                    activeTable?.id === table.id ? "border-amber-400" : "border-transparent"
                  } ${table.is_occupied ? "bg-red-500/20" : "bg-green-500/20"}`}
                >
                  <h3 className="text-xl font-bold">Table {table.table_number}</h3>
                  <p className="mt-2 text-slate-300">Cap: {table.capacity}</p>
                  <p className={`mt-3 font-bold ${table.is_occupied ? "text-red-400" : "text-green-400"}`}>
                    {table.is_occupied ? "Occupied" : "Available"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div>
          {activeSelectedTable ? (
            <div className="bg-white/10 p-6 rounded-3xl sticky top-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Table {activeSelectedTable.table_number}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  activeSelectedTable.is_occupied ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                }`}>
                  {activeSelectedTable.is_occupied ? "Occupied" : "Available"}
                </span>
              </div>

              {/* Order Form */}
              <form onSubmit={addOrder} className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Select Item</label>
                  <select
                    value={selectedFood}
                    onChange={(e) => setSelectedFood(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-amber-500"
                  >
                    <option value="">-- Choose Food --</option>
                    {menuItems.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} - ₹{item.price}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-1/3">
                    <label className="block text-sm text-slate-400 mb-2">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="flex-1 flex items-end">
                    <button
                      type="submit"
                      disabled={!selectedFood || isLoading}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition disabled:opacity-50"
                    >
                      {isLoading ? "Adding..." : "Add to Order"}
                    </button>
                  </div>
                </div>
              </form>

              {/* Current Bill */}
              {currentOrder && (
                <div className="border-t border-slate-700 pt-6">
                  <h4 className="font-bold mb-4 text-slate-300">Current Order</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {currentOrder.items.map((item) => (
                      <div key={item.id} className="bg-slate-900 p-3 rounded-xl flex justify-between items-center border border-transparent hover:border-slate-700">
                        <div>
                          <p className="font-bold">{item.menu_item_name}</p>
                          <p className="text-sm text-slate-400">₹{item.price_at_time} × {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-bold">₹{item.price_at_time * item.quantity}</p>
                          <button 
                            onClick={() => removeOrderItem(item.id)}
                            className="text-red-500 hover:bg-red-500/20 p-2 rounded-lg transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between items-center">
                    <span className="text-xl text-slate-400">Total</span>
                    <span className="text-3xl font-bold text-amber-500">
                      ₹{currentOrder.total_amount}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center text-slate-400 h-full flex items-center justify-center">
              Select a table from the left to view or add orders.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}