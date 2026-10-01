import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/Authenticator";
import "./DashboardPage.css";


/**
 * Componente DashboardPage
 *
 * Vista principal para usuarios autenticados de la aplicación Todo.
 * Muestra el email del usuario logueado y permite cerrar sesión.
 * Protegida por RequireAuth — solo accesible con sesión activa.
 */
const DashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Maneja el cierre de sesión y redirige al login si falla
    const handleCloseSession = async () => {
        try {
            await logout();
        } catch {
            navigate("/login");
        }
    };

    return (
        // Contenedor principal: centra la card con fondo degradado tierra
        <div className="dashboard-container">
            {/* Card centrada con sombra y bordes redondeados */}
            <div className="dashboard-card">
                {/* Título principal del dashboard */}
                <h1 className="dashboard-title">Dashboard</h1>
                {/* Email del usuario autenticado */}
                <p className="dashboard-email">User: {user?.email}</p>
                {/* Mensaje de bienvenida */}
                <p className="dashboard-welcome">¡Bienvenido a tu aplicación Todo!</p>
                {/* Botón de cierre de sesión */}
                <button className="dashboard-logout" onClick={handleCloseSession}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;
