// Define types for the database records
export interface User {
  id: number;
  username: string;
  email?: string;
  password_hash?: string;
  github_id?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  is_done: boolean;
  user_id: number;
}
