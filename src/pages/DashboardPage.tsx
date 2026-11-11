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


//esto debemos agregarlo
type FormStatus = "idle" | "loading" | "success" | "error";

type ApiResponse = {
    message?: string;
    error?: string;
    detail?: string;
};



const DashboardPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    // Estados para la edición en línea de una tarea
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    //Estados del correo para añadir tarea
    const [status, setStatus] = useState<FormStatus>("idle");
    const [feedback, setFeedback] = useState("");
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;


    //Estados del correo para reporte
    const [isSendingReport, setIsSendingReport] = useState(false);
    const [reportFeedback, setReportFeedback] = useState("");
    const [reportStatus, setReportStatus] = useState<FormStatus>("idle");


    //como no puedo ejecutar un use effect asincrono, lo que hago es crear una funcion asincrona dentro de un useEffect y la ejecuto al final
    useEffect(() => {
        const loadTasks = async () => {
            if (!user?.uid) {
                setIsLoading(false);
                return;
            }
            try {
                const data = await getTasks(user.uid);
                setTasks(data);
            } catch (error) {
                setError("Error al cargar tareas");
            } finally {
                setIsLoading(false);
            }
        };
        loadTasks();
    }, [user?.uid]);

    // Oculta el mensaje de éxito unos segundos después de mostrarse.
    // Solo administra la visibilidad del feedback: no interviene en el envío.
    useEffect(() => {
        if (status !== "success") return;

        const timer = setTimeout(() => {
            setFeedback("");
            setStatus("idle");
        }, 4000);

        return () => clearTimeout(timer);
    }, [status]);

    // Mismo comportamiento para el mensaje de éxito del reporte.
    useEffect(() => {
        if (reportStatus !== "success") return;

        const timer = setTimeout(() => {
            setReportFeedback("");
            setReportStatus("idle");
        }, 4000);

        return () => clearTimeout(timer);
    }, [reportStatus]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        //setIsLoading(true);
        //esto debemos crearlo
        setStatus("loading");
        setFeedback("Enviando mensaje...");

        try {
            const newTask = await addTask({
                title: title,
                description: description,
                completed: false,
                userId: user?.uid ?? "unknown",
                createdAt: new Date().toISOString(),
            });

            //esto debemos crearlo
            const response = await fetch("/api/send-email", {
                method: "POST",
                //esto debemos crearlo
                headers: {
                    "Content-Type": "application/json",
                },
                //esto debemos crearlo
                body: JSON.stringify({
                    name: user?.displayName ?? user?.email ?? "Usuario",
                    email: user?.email ?? "",
                    message: `Nueva tarea: ${title}\nDescripción: ${description}`,
                }),
            });
            //esto debemos crearlo con otra variable
            const data1 = (await response.json()) as ApiResponse;

            //esto debemos crearlo
            if (!response.ok) {
                const errorMessage = data1.error ?? "No se pudo enviar el mensaje";

                throw new Error(
                    data1.detail ? `${errorMessage}: ${data1.detail}` : errorMessage,
                );
            }

            //esto debemos crearlo
            setStatus("success");
            setFeedback(data1.message ?? "Mensaje enviado correctamente");

            setTasks([...tasks, newTask]);
            setTitle("");
            setDescription("");

        } catch (error) {
            //cambiar para presentar el proyecto y forzar que el envio del correo 
            setError("Error al crear la tarea");
            //esto debemos agregarlo
            setStatus("error");
            setFeedback(
                error instanceof Error ? error.message : "Ocurrió un error inesperado",
            );


        } finally {
            setIsLoading(false);
        }
    };
    const handleReporte = async ()=>{
        setIsSendingReport(true);
        setReportStatus("loading");
        setReportFeedback("Enviando reporte...");

        try {
                const response = await fetch("/api/send-email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: user?.displayName ?? user?.email ?? "Usuario",
                        email: user?.email ?? "",
                        message: `Resumen de Tareas:\n` +
                                `- Tareas totales: ${totalTasks}\n` +
                                `- Tareas pendientes: ${pendingTasks}\n` +
                                `- Tareas completadas: ${completedTasks}`,
                        }),
                });
            const data = (await response.json()) as ApiResponse;
            if (!response.ok) {
                const errorMessage = data.error ?? "No se pudo enviar el reporte";
                throw new Error(data.detail ? `${errorMessage}: ${data.detail}` : errorMessage);
            }
            setReportStatus("success");
            setReportFeedback("¡Reporte enviado exitosamente!");

        } catch (error) {
            setReportStatus("error");
            setReportFeedback(
                error instanceof Error ? error.message : "Error al enviar el reporte",
            );
            
        }finally{
            setIsSendingReport(false);
        }

    }
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


    const handleEditar = async (
        task: Task,
        action: "start" | "save" | "cancel" = "start",
    ) => {
        // Cancela la edición y limpia los campos
        if (action === "cancel") {
            setEditingTaskId(null);
            setEditTitle("");
            setEditDescription("");
            return;
        }

        // Activa el modo edición con los datos actuales de la tarea
        if (action === "start") {
            setEditingTaskId(task.id);
            setEditTitle(task.title);
            setEditDescription(task.description);
            return;
        }

        // Guarda los cambios (misma validación que al crear: título mínimo de 2 caracteres)
        if (editTitle.trim().length < 2) return;

        setIsLoading(true);

        try {
            const updatedTask = await updateTask({
                ...task,
                title: editTitle.trim(),
                description: editDescription.trim(),
            });
            setTasks(
                tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
            );
            setEditingTaskId(null);
            setEditTitle("");
            setEditDescription("");
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
            <div className="dashboard-container dashboard-container--status">
                <div className="dashboard-card dashboard-status-card">
                    <p>Cargando tareas...</p>
                </div>
            </div>
        )
    }

    //Early return
    if (error) {
        return (
            <div className="dashboard-container dashboard-container--status">
                <div className="dashboard-card dashboard-status-card">
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
        // Contenedor principal: fondo degradado tierra y cards apiladas
        <div className="dashboard-container">
            {/* HEADER: usuario, UID, bienvenida y cierre de sesión */}
            <header className="dashboard-card dashboard-header">
                <div className="dashboard-header-info">
                    {/* Título principal del dashboard */}
                    <h1 className="dashboard-title">Dashboard</h1>
                    {/* Mensaje de bienvenida */}
                    <p className="dashboard-welcome">¡Bienvenido a tu aplicación Todo!</p>

                    <div className="dashboard-user-data">
                        {/* Email del usuario autenticado */}
                        <p className="dashboard-email">
                            <span className="dashboard-label">Usuario</span>
                            {user?.email}
                        </p>
                        {/* UID del usuario autenticado */}
                        <p className="dashboard-email dashboard-uid">
                            <span className="dashboard-label">UID</span>
                            {user?.uid}
                        </p>
                    </div>

                    <div className="Resumen-tareas">
                        <div>
                            <p>Tareas totales</p>
                            <h4>{totalTasks}</h4>
                        </div>

                        <div>
                            <p>Tareas pendientes</p>
                            <h4>{pendingTasks}</h4>
                        </div>

                        <div>
                            <p>Tareas completadas</p>
                            <h4>{completedTasks}</h4>
                        </div>

                        <Button variant="danger" onClick={() => void handleReporte()} disabled={isSendingReport}>
                            {isSendingReport ? "Enviando..." : "Reporte"}
                        </Button>
                        {/* Mensaje de estado del reporte */}
                        {reportFeedback && (
                            <span
                                className={`dashboard-report-feedback dashboard-report-feedback--${reportStatus}`}
                                role="status"
                            >
                                {reportFeedback}
                            </span>
                        )}

                        

                    </div>
                </div>

                {/* Botón de cierre de sesión */}
                <button className="dashboard-logout" onClick={handleCloseSession}>
                    Cerrar sesión
                </button>
            </header>

            {/* Card ancha: formulario para agregar tareas y listado */}
            <main className="dashboard-card dashboard-main-card">
                <h2 className="dashboard-section-title">Nueva tarea</h2>

                <form className="dashboard-form" onSubmit={handleSubmit}>
                    <div className="dashboard-field">
                        <label htmlFor="task-title">Título de la tarea</label>
                        <input
                            className="dashboard-input"
                            id="task-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Escribí una tarea"
                        />
                    </div>

                    <div className="dashboard-field">
                        <label htmlFor="task-description">Descripción</label>
                        <input
                            className="dashboard-input"
                            id="task-description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Escribí una descripción"
                        />
                    </div>

                    {/* Esta validacion es simple, debe ser mejorada y mas exacta */}
                    <Button className="dashboard-add-button" type="submit" disabled={title.length < 2 && status === "loading"}>
                        Agregar
                    </Button>
                    {feedback && (
                        <p className={`dashboard-feedback dashboard-feedback--${status}`} role="status">
                            {feedback}
                        </p>
                    )}
                </form>

                <div className="dashboard-task-list">
                    {tasks.length !== 0 ? (
                        tasks.map((task, i) => (
                            <article
                                className={`dashboard-task-item${editingTaskId === task.id ? " dashboard-task-item--editing" : ""}`}
                                key={i}
                            >
                                {editingTaskId === task.id ? (
                                    // Modo edición: inputs para título y descripción
                                    <div className="dashboard-task-edit">
                                        <div className="dashboard-field">
                                            <label htmlFor={`edit-title-${task.id}`}>Título de la tarea</label>
                                            <input
                                                className="dashboard-input"
                                                id={`edit-title-${task.id}`}
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                placeholder="Escribí un título"
                                            />
                                        </div>

                                        <div className="dashboard-field">
                                            <label htmlFor={`edit-description-${task.id}`}>Descripción</label>
                                            <input
                                                className="dashboard-input"
                                                id={`edit-description-${task.id}`}
                                                type="text"
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                placeholder="Escribí una descripción"
                                            />
                                        </div>

                                        <div className="dashboard-task-actions">
                                            <Button
                                                onClick={() => void handleEditar(task, "save")}
                                                disabled={editTitle.trim().length < 2}
                                            >
                                                Guardar
                                            </Button>
                                            <Button variant="ghost" onClick={() => void handleEditar(task, "cancel")}>
                                                Cancelar
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    // Modo lectura: datos de la tarea y acciones
                                    <>
                                        <div className="dashboard-task-info">
                                            <h3 className="dashboard-task-title">{task.title}</h3>
                                            <p className="dashboard-task-description">{task.description}</p>
                                            <p className="dashboard-task-meta">
                                                <span className={`dashboard-badge ${task.completed ? "dashboard-badge--done" : "dashboard-badge--pending"}`}>
                                                    {task.completed ? "Completada" : "Pendiente"}
                                                </span>
                                                <span>Fecha: {new Date(task.createdAt).toLocaleString("es")}</span>
                                            </p>
                                        </div>

                                        <div className="dashboard-task-actions">
                                            <Button onClick={() => void handleToggle(task)}>
                                                {task.completed ? "Pendiente" : "Completa"}
                                            </Button>
                                            <Button variant="ghost" onClick={() => void handleEditar(task)}>
                                                Editar
                                            </Button>
                                            <Button variant="danger" onClick={() => void handleDelete(task)}>
                                                Eliminar
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </article>
                        ))
                    ) : (
                        <p className="dashboard-empty">No hay tareas todavía.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;


