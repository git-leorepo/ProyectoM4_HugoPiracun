import { Link } from "react-router-dom";
import type { JSX } from "react/jsx-runtime";
import type { ReactNode } from "react";

interface NavbarProps {
    children?: ReactNode;
}



function Navbar({ children }: NavbarProps): JSX.Element {
    return (
        <>
            <nav>
                <Link to="/">Login</Link>
                {" | "}
                <Link to="/register">Register</Link>
                {" | "}
                <Link to="/task">Task</Link>
            </nav>

            <main>
                {children}
            </main>
        </>

    );
}

export default Navbar;