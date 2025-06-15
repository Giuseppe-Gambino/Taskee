export interface Board {
  id: string;
  name: string;
  columns: Column[];
}

export interface Column {
  name: string;
  color: string;
  tasks: Task[];
}

export interface Task {
  description: string;
}
