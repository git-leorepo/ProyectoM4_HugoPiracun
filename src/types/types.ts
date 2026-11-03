export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    userId: string;
    createdAt: string;    
}

/*porque se va a crear en firestore, el lo va a generar solo*/
export type NewTask = Omit<Task, "id">
