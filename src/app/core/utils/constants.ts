export const API = {
  AUTH: '/auth/v1',
  PROJECT: '/rest/v1/projects',
  MEMBERS: '/rest/v1/get_project_members',
  EPICS: '/rest/v1/epics',
  PROJECT_EPICS: '/rest/v1/project_epics',
  TASKS: '/rest/v1/tasks'
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  SESSION_EXPIRY: 'session_expiry',
} as const;
