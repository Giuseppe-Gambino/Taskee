export interface Board {
  user: string;
  id: string;
  name: string;
  columns: Column[];
}

export interface Column {
  id?: string;
  name: string;
  color: string;
  tasks: Task[];
}

export interface Task {
  description: string;
}
