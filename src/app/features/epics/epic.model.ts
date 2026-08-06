export interface CreateEpicRequest {
  title: string;
  description?: string | null;
  assignee_id?: string | null;
  project_id: string;
  deadline?: string | null;
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