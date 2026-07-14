export interface SignUpRequest {
  email: string;
  password: string;
  data: UserData;
}

export interface UserData {
  name: string;
  job_title: string;
}

export interface GetUserResponse {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    department?: string;
    job_title?: string;
  };
}

export interface SignUpResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
}
