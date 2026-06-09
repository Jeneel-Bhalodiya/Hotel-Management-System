import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("access_token");
    const userString = localStorage.getItem("user");
    
    if (!token || !userString) {
        return <Navigate to="/" replace />;
    }

    try {
        const user = JSON.parse(userString);
        
        if (allowedRoles && !allowedRoles.includes(user.role)) {
            // Redirect to appropriate dashboard if unauthorized
            if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
            return <Navigate to="/employee" replace />;
        }
        
        return children;
    } catch (e) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        return <Navigate to="/" replace />;
    }
}
