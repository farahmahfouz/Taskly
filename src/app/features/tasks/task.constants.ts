export const TASK_STATUS = [
  { value: 'TO_DO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'BLOCKED', label: 'Blocked' },
  { value: 'IN_REVIEW', label: 'In Review' },
  { value: 'READY_FOR_QA', label: 'Ready for QA' },
  { value: 'REOPENED', label: 'Reopened' },
  { value: 'READY_FOR_PRODUCTION', label: 'Ready for Production' },
  { value: 'DONE', label: 'Done' },
];

export type TaskStatus =
  | 'TO_DO'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'IN_REVIEW'
  | 'READY_FOR_QA'
  | 'REOPENED'
  | 'READY_FOR_PRODUCTION'
  | 'DONE';

export interface CreateTaskRequest {
  project_id: string;
  epic_id?: string;
  title: string;
  description?: string;
  assignee_id?: string;
  due_date?: string;
  status: TaskStatus;
}