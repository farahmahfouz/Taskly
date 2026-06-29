export interface SignUpRequest {
  email: string;
  password: string;
  data: UserData;
}

export interface UserData {
  name: string;
  job_title: string;
}
