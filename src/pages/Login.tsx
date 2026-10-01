import type { JSX } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import ButtonLogin from "../componentes/ButtonLogin";

interface LoginProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

function Login({ isAuthenticated, setIsAuthenticated }: LoginProps): JSX.Element {
  const navigate = useNavigate();

  const handleAuth = () => {
    const nuevoEstado = !isAuthenticated;
    setIsAuthenticated(nuevoEstado);

    // Si acaba de iniciar sesión, lo redirigimos a la página de tareas
    if (nuevoEstado) {
      navigate("/task");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <p>Estado actual: {isAuthenticated ? "Autenticado" : "No Autenticado"}</p>

      <ButtonLogin
        text={isAuthenticated ? "Cerrar Sesión" : "Iniciar Sesión"}
        isAuthenticated={isAuthenticated}
        onClick={handleAuth}
      />
    </div>
  );
}

export default Login;