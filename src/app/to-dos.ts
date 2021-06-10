export interface ToDo {
  id: string;
  description: string;
  isComplete: boolean;
  dueDate: string;
  sortOrder: number;
  formattedDueDate: Date;
}