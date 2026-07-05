export interface Project {
  id?: string;
  name: string;
  description?: string;
  created_at?: string;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
}
