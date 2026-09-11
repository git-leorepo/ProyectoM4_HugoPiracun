import type { JSX } from "react/jsx-runtime";

interface ButtonLoginProps {
  text: string;
  isAuthenticated: boolean;
  onClick: () => void; // Cambiado onclick -> onClick
}

function ButtonLogin({ text, isAuthenticated, onClick }: ButtonLoginProps): JSX.Element {
  return (
    <button onClick={onClick}>
      {text} - {isAuthenticated ? "Sesión Iniciada" : "Sesión Cerrada"}
    </button>
  );
}

export default ButtonLogin;