export interface CreateEpicRequest {
  title: string;
  description?: string;
  assignee_id?: string;
  project_id: string;
  deadline?: string;
}

export interface Epic {
  id: string;
  epic_id: string;
  title: string;
  description: string;
  deadline: string;
  created_at: string;
  created_by: EpicUser;
  assignee: EpicUser | null;
}

export interface EpicUser {
  sub: string;
  name: string;
  email: string;
  department: string;
}