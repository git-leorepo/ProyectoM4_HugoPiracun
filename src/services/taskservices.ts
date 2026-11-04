import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where, orderBy } from "firebase/firestore";
import type { NewTask, Task } from "../types/types";
import { db } from "./firebase";

//const STORAGE_KEY = "tasks";
const TASKS_COLLECTION = "tasks";

//const delay = () => new Promise((resolve) => setTimeout(resolve, 2000));


export const getTasks = async (userId: string): Promise<Task[]> => {
    //await delay();
    const q = query(
        collection(db, TASKS_COLLECTION),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    )
    /* const localTasks = localStorage.getItem(STORAGE_KEY);
    return JSON.parse((localTasks || "[]") as string) as Task[]; */
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Task[];
};

export const addTask = async (task: NewTask): Promise<Task> => {
    /* await delay();
    const localTasks = localStorage.getItem(STORAGE_KEY);
    const tasks = localTasks === null ? [] : JSON.parse(localTasks);

    

    const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...tasks, newTask]));

    return newTask; */

    const docRef = await addDoc(collection(db, TASKS_COLLECTION), task);
    return { id: docRef.id, ...task }

};

export const updateTask = async (task: Task): Promise<Task> => {
    /* await delay();
    const { id, ...changes } = task;
    const localTasks = localStorage.getItem(STORAGE_KEY);
    const tasks: Task[] = localTasks === null ? [] : JSON.parse(localTasks);

    const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, ...changes } : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));

    return task; */

    const { id, ...changes } = task;
    await updateDoc(doc(db, TASKS_COLLECTION, id), changes);
    return task;


};

export const deleteTask = async (task: Task): Promise<Task> => {
    /* await delay();
    const { id } = task;
    const localTasks = localStorage.getItem(STORAGE_KEY);
    const tasks: Task[] = localTasks === null ? [] : JSON.parse(localTasks);
    const newTasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    return task; */

    const { id } = task;

    await deleteDoc(doc(db, TASKS_COLLECTION, id));

    return task;

};