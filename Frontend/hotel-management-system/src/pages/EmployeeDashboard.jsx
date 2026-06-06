import {
  ClipboardList,
  BedDouble,
  UserCheck,
} from "lucide-react";

export default function EmployeeDashboard() {
  const tasks = [
    "Room 101 Cleaning",
    "Check-in Guest Room 203",
    "Deliver Room Service",
    "Update Room Status",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6">
        <h1 className="text-2xl font-bold text-blue-400">
          Employee Panel
        </h1>

        <nav className="mt-10 space-y-3">
          <div className="p-3 rounded-xl bg-blue-500 text-white">
            Dashboard
          </div>

          <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
            Assigned Rooms
          </div>

          <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
            Check In
          </div>

          <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
            Check Out
          </div>

          <div className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer">
            Profile
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h2 className="text-4xl font-bold">
          Employee Dashboard
        </h2>

        <p className="text-slate-400 mt-2">
          Daily Tasks & Room Management
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/10 rounded-3xl p-6">
            <BedDouble size={30} />
            <h3 className="text-xl mt-4">
              Assigned Rooms
            </h3>
            <p className="text-3xl font-bold mt-2">
              12
            </p>
          </div>

          <div className="bg-white/10 rounded-3xl p-6">
            <UserCheck size={30} />
            <h3 className="text-xl mt-4">
              Check-Ins Today
            </h3>
            <p className="text-3xl font-bold mt-2">
              7
            </p>
          </div>

          <div className="bg-white/10 rounded-3xl p-6">
            <ClipboardList size={30} />
            <h3 className="text-xl mt-4">
              Pending Tasks
            </h3>
            <p className="text-3xl font-bold mt-2">
              4
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white/10 rounded-3xl p-6">
          <h3 className="text-2xl font-semibold mb-4">
            Today's Tasks
          </h3>

          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div
                key={index}
                className="p-4 bg-slate-900 rounded-xl"
              >
                {task}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}