import { useState } from "react";
import { useAuth } from "../features/auth/Authenticator";
import { Link, useNavigate } from "react-router-dom";
import { getAuthErrorMessage } from "../features/auth/authErrors"
import "./LoginPage.css";

/**
 * Componente LoginPage
 *
 * Vista de inicio de sesión para la aplicación Todo.
 * Permite autenticarse usando email/contraseña o autenticación con Google.
 * Al iniciar sesión exitosamente, redirige al dashboard.
 */
const LoginPage = () => {
    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Maneja el inicio de sesión con email y contraseña
    const handleSignIn = async () => {
        try {
            await signIn(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(getAuthErrorMessage(err));
        }
    };

    // Maneja el inicio de sesión con Google
    const handleWithInGoogle = async () => {
        try {
            await signInWithGoogle();
            navigate("/dashboard");
        } catch (err) {
            setError(getAuthErrorMessage(err));
        }
    };

    return (
        <>
            {/* Contenedor principal: centra la card con fondo degradado tierra */}
            <section className="login-container">
                {/* Card blanca con sombra y bordes redondeados */}
                <div className="login-card">
                    {/* Título principal de la card */}
                    <h1 className="login-title">Bienvenido de nuevo</h1>
                    {/* Subtítulo debajo del título */}
                    <p className="login-subtitle">Inicia sesión para continuar</p>

                    {/* Mensaje de error con fondo terracota suave */}
                    {error && <p className="login-error">{error}</p>}

                    {/* Formulario: inputs y botón en columna */}
                    <div className="login-form">
                        {/* Campo de email */}
                        <input
                            className="login-input"
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {/* Campo de contraseña */}
                        <input
                            className="login-input"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {/* Botón principal de login */}
                        <button className="login-button" onClick={handleSignIn}>Login</button>
                    </div>

                    {/* Separador "o continúa con" */}
                    <div className="login-divider">
                        <span className="login-divider-text">o continúa con</span>
                    </div>

                    {/* Botón de Google con ícono */}
                    <button className="login-google" onClick={handleWithInGoogle}>
                        <svg className="login-google-icon" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Login with Google
                    </button>

                    {/* Pie de página con enlace a registro */}
                    <p className="login-footer">
                        ¿No tienes cuenta? <Link className="login-link" to={"/"}>Register</Link>
                    </p>
                </div>
            </section>
        </>
    );
};

export default LoginPage;
