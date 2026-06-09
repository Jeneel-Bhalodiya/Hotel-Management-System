import { useEffect, useState } from "react";
import {
  ClipboardList,
  CheckCircle,
  Users,
} from "lucide-react";

export default function EmployeeDashboard() {
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const [activeTable, setActiveTable] = useState(null);

  const [selectedTable, setSelectedTable] = useState("");
  const [selectedFood, setSelectedFood] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const storedTables =
      JSON.parse(localStorage.getItem("tables")) || [];

    const storedMenu =
      JSON.parse(localStorage.getItem("menuItems")) || [];

    const storedOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    setTables(storedTables);
    setMenuItems(storedMenu);
    setOrders(storedOrders);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "tables",
      JSON.stringify(tables)
    );
  }, [tables]);

  useEffect(() => {
    localStorage.setItem(
      "orders",
      JSON.stringify(orders)
    );
  }, [orders]);

  const toggleTableStatus = (id) => {
    const updatedTables = tables.map((table) =>
      table.id === id
        ? {
            ...table,
            occupied: !table.occupied,
          }
        : table
    );

    setTables(updatedTables);

    if (
      activeTable &&
      activeTable.id === id
    ) {
      const updatedActive =
        updatedTables.find(
          (table) => table.id === id
        );

      setActiveTable(updatedActive);
    }
  };

  const addOrder = (e) => {
    e.preventDefault();

    if (
      !selectedTable ||
      !selectedFood ||
      quantity < 1
    )
      return;

    const menuItem = menuItems.find(
      (item) => item.name === selectedFood
    );

    const newOrder = {
      id: Date.now(),
      tableNo: selectedTable,
      itemName: selectedFood,
      quantity: Number(quantity),
      price: menuItem?.price || 0,
    };

    setOrders([...orders, newOrder]);

    setSelectedFood("");
    setQuantity(1);
  };

  const completeOrder = (id) => {
    setOrders(
      orders.filter(
        (order) => order.id !== id
      )
    );
  };

  const occupiedTables = tables.filter(
    (table) => table.occupied
  ).length;

  const availableTables =
    tables.length - occupiedTables;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="flex items-center gap-3">
        <Users
          size={40}
          className="text-amber-500" 
        />
        <h2 className="text-4xl font-bold">
          Admin Dashboard
        </h2>
      </div>
      {/* Dashboard Cards */}

      <div className="grid md:grid-cols-4 gap-6 p-8">

        <div className="bg-white/10 p-6 rounded-3xl">
          
          <h3 className="mt-3 text-lg">
            Total Tables
          </h3>
          <p className="text-3xl font-bold">
            {tables.length}
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-3xl">
          <CheckCircle size={32} />
          <h3 className="mt-3 text-lg">
            Occupied
          </h3>
          <p className="text-3xl font-bold">
            {occupiedTables}
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-3xl">
          
          <h3 className="mt-3 text-lg">
            Available
          </h3>
          <p className="text-3xl font-bold">
            {availableTables}
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-3xl">
          <ClipboardList size={32} />
          <h3 className="mt-3 text-lg">
            Active Orders
          </h3>
          <p className="text-3xl font-bold">
            {orders.length}
          </p>
        </div>

      </div>

      {/* Table Cards */}

      <div className="mt-10">

        <h2 className="text-2xl font-bold mb-5">
          Restaurant Tables
        </h2>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">

          {tables.map((table) => (

            <div
              key={table.id}
              onClick={() =>
                setActiveTable(table)
              }
              className={`
                cursor-pointer
                p-5
                rounded-2xl
                border-2
                transition-all
                hover:scale-105
                ${
                  activeTable?.id === table.id
                    ? "border-amber-400"
                    : "border-transparent"
                }
                ${
                  table.occupied
                    ? "bg-red-500/20"
                    : "bg-green-500/20"
                }
              `}
            >

              <h3 className="text-xl font-bold">
                Table {table.tableNo}
              </h3>

              <p className="mt-2 text-slate-300">
                Capacity: {table.capacity}
              </p>

              <p
                className={`mt-3 font-bold ${
                  table.occupied
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {table.occupied
                  ? "Occupied"
                  : "Available"}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTableStatus(
                    table.id
                  );
                }}
                className={`mt-4 w-full py-2 rounded-xl font-bold ${
                  table.occupied
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
              >
                {table.occupied
                  ? "Release Table"
                  : "Occupy Table"}
              </button>

            </div>

          ))}

        </div>

      </div>

      {/* Selected Table */}

      {activeTable && (

        <div className="mt-10 bg-white/10 p-6 rounded-3xl">

          <h2 className="text-3xl font-bold">
            Table {activeTable.tableNo}
          </h2>

          <p className="text-slate-400 mt-2">
            Capacity: {activeTable.capacity}
          </p>

          <div className="mt-6">

            <h3 className="text-xl font-bold mb-4">
              Orders
            </h3>

            {orders.filter(
              (order) =>
                Number(order.tableNo) ===
                Number(
                  activeTable.tableNo
                )
            ).length === 0 ? (

              <p className="text-slate-400">
                No Orders Found
              </p>

            ) : (

              <div className="space-y-3">

                {orders
                  .filter(
                    (order) =>
                      Number(
                        order.tableNo
                      ) ===
                      Number(
                        activeTable.tableNo
                      )
                  )
                  .map((order) => (

                    <div
                      key={order.id}
                      className="bg-slate-900 p-4 rounded-xl flex justify-between items-center"
                    >

                      <div>
                        <h4 className="font-bold">
                          {order.itemName}
                        </h4>

                        <p>
                          Qty:{" "}
                          {order.quantity}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          completeOrder(
                            order.id
                          )
                        }
                        className="bg-green-500 px-4 py-2 rounded-xl"
                      >
                        Complete
                      </button>

                    </div>

                  ))}

              </div>

            )}

          </div>

        </div>

      )}

      

    </div>
  );
}