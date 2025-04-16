export interface TaskResponse {
  id: number;
  username: string;
  title: string;
  description: string;
  due_date: Date;
  status: boolean;
}

export type CreateTaskRequest = Omit<TaskResponse, 'id'>;

export type UpdateTaskRequest = TaskResponse;

export type SearchTaskRequest = Partial<
  Omit<TaskResponse, 'id' | 'username'>
> & {
  page?: number;
  size?: number;
};
