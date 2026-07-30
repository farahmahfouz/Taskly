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

export interface InviteMemberRequest {
  p_email: string;
  p_project_id: string;
  p_app_url: string;
  p_base_url: string;
}

export interface AcceptInviteRequest {
  p_token: string;
}
