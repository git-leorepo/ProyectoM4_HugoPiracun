import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/Authenticator";
import "./DashboardPage.css";
import { useEffect, useState } from "react";
import { addTask, deleteTask, getTasks, updateTask } from "../services/taskservices";
import type { Task } from "../types/types";
import Button from "../componentes/ui/button/button";


/**
 * Componente DashboardPage
 *
 * Vista principal para usuarios autenticados de la aplicación Todo.
 * Muestra el email del usuario logueado y permite cerrar sesión.
 * Protegida por RequireAuth — solo accesible con sesión activa.
 */
const DashboardPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");



    //como no puedo ejecutar un use effect asincrono, lo que hago es crear una funcion asincrona dentro de un useEffect y la ejecuto al final
    useEffect(() => {
        const loadTasks = async () => {
            try {
                const data = await getTasks();
                setTasks(data);
            } catch (error) {
                setError("Error al cargar tareas");
            } finally {
                setIsLoading(false);
            }
        };
        loadTasks();
    }, []);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const newTask = await addTask({
                title: title,
                description: description,
                completed: false,
                userId: user?.uid ?? "unknown",
                createdAt: new Date().toISOString(),
            });

            setTasks([...tasks, newTask]);
            setTitle("");
            setDescription("");
        } catch {
            setError("Error al crear la tarea");
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = async (task: Task) => {
        setIsLoading(true);

        try {
            const updatedTask = await updateTask({
                ...task,
                completed: !task.completed,
            });
            setTasks(
                tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
            );
            setTitle("");
        } catch {
            setError("Error al actualizar la tarea");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (task: Task) => {
        setIsLoading(true);

        try {
            const deletedTask = await deleteTask(task);
            setTasks(tasks.filter((task) => task.id !== deletedTask.id));
            setTitle("");
        } catch {
            setError("Error al borrar la tarea");
        } finally {
            setIsLoading(false);
        }
    };

    //Early return
    if (isLoading) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-card">
                    <p>Cargando tareas...</p>
                </div>
            </div>
        )
    }

    //Early return
    if (error) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-card">
                    <p>Error al cargar tareas</p>
                </div>
            </div>
        )
    }

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
                {/* UID  del usuario autenticado */}
                <p className="dashboard-email">UID: {user?.uid}</p>
                {/* Mensaje de bienvenida */}
                <p className="dashboard-welcome">¡Bienvenido a tu aplicación Todo!</p>
                {/* Botón de cierre de sesión */}
                <button className="dashboard-logout" onClick={handleCloseSession}>
                    Logout
                </button>
            </div>
            <br />
            <div className="dashboard-card">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="task-title">Titulo Tarea:   </label>
                    <input
                        id="task-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Escribí una tarea"
                    />
                    <label htmlFor="task-title">Descripcion:   </label>
                    <input
                        id="task-description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Escribí una descripcion"
                    />

                    <br />
                    {/* Esta validacion es simple, debe ser mejorada y mas exacta */}
                    <Button type="submit" disabled={title.length < 2}>
                        Agregar
                    </Button>
                </form>

                {tasks.length !== 0 ? (
                    tasks.map((task, i) => (
                        <div key={i}>
                            <p>Titulo tarea: {task.title}</p>
                            <p>Descripcion: {task.description}</p>
                            <p>
                                Estado: {task.completed ? "Completada" : "Pendiente"}{" "}
                                <br />
                                Fecha: {new Date(task.createdAt).toLocaleString("es")}
                            </p>
                            <Button onClick={() => void handleToggle(task)}>
                                {task.completed ? "Marcar pendiente" : "Completar"}
                            </Button>
                            <Button variant="danger" onClick={() => void handleDelete(task)}>
                                Eliminar
                            </Button>
                        </div>
                    ))
                ) : (
                    <p>No hay tareas</p>
                )}

            </div>

        </div>
    );
};

export default DashboardPage;


