import { Navigate, useLocation } from "react-router-dom";
import { type ReactNode, type JSX } from "react";
import { useAuth } from "../features/auth/Authenticator";


function RequireAuth({ children }: { children: ReactNode }): JSX.Element {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <p>Cargando sesión...</p>;
    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    return <>{children}</>;
}

export default RequireAuth;