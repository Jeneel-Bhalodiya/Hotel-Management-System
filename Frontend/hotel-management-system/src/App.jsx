import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HotelSetup from "./pages/HotelSetup";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Tables from "./pages/Tables";
import Employees from "./pages/Employees";
import Menu from "./pages/Menu";
import Dashboard from "./pages/Dashboard";
import OnlineOrder from "./pages/OnlineOrder";
import Reports from "./pages/Reports";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={<Login />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Protected Admin Routes */}
        <Route
          path="/hotel-setup"
          element={<ProtectedRoute allowedRoles={["ADMIN"]}><HotelSetup /></ProtectedRoute>}
        />
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>}
        />
        <Route
          path="/admin/tables"
          element={<ProtectedRoute allowedRoles={["ADMIN"]}><Tables /></ProtectedRoute>}
        />
        <Route
          path="/admin/employees"
          element={<ProtectedRoute allowedRoles={["ADMIN"]}><Employees /></ProtectedRoute>}
        />
        <Route
          path="/admin/menu"
          element={<ProtectedRoute allowedRoles={["ADMIN"]}><Menu /></ProtectedRoute>}
        />
        <Route
          path="/admin/orders"
          element={<ProtectedRoute allowedRoles={["ADMIN"]}><OnlineOrder /></ProtectedRoute>}
        />
        <Route
          path="/admin/reports"
          element={<ProtectedRoute allowedRoles={["ADMIN"]}><Reports /></ProtectedRoute>}
        />

        {/* Protected Employee Route */}
        <Route
          path="/employee"
          element={<ProtectedRoute allowedRoles={["WAITER"]}><EmployeeDashboard /></ProtectedRoute>}
        />

        {/* General Protected Route */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;