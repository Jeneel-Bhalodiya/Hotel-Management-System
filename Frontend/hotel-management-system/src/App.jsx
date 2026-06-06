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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<Login />} 
        />
        <Route
          path="/signup"
          element={<Signup />}
        />
        <Route
          path="/hotel-setup"
          element={<HotelSetup />}
        />
        <Route 
          path="/admin" 
          element={<AdminDashboard />} 
        />
        <Route  
          path="/employee" 
          element={<EmployeeDashboard />}   
        />
        <Route
          path="/admin/tables"
          element={<Tables />}
        />
        <Route
          path="/admin/employees"
          element={<Employees />}
        />  
        <Route
          path="/admin/menu"
          element={<Menu />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;