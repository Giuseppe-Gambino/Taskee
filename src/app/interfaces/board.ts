export interface Board {
  id: string;
  name: string;
  color: string;
  columns: Column[];
}

export interface BoardDTO {
  id: string;
  name: string;
  color: string;
}

export interface Column {
  id?: string;
  name: string;
  color: string;
  order: number;
  tasks: Task[];
}

export interface Task {
  id?: string;
  description: string;
  order: number;
}
