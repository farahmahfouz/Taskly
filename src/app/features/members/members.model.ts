export interface Member {
  member_id: string;
  user_id: string;
  email: string;
  role: string;
  metadata: {
    name: string;
    department: string;
    email: string;
  };
}
