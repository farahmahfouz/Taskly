export type TaskStatus =
  | 'TO_DO'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'IN_REVIEW'
  | 'READY_FOR_QA'
  | 'REOPENED'
  | 'READY_FOR_PRODUCTION'
  | 'DONE';

export interface DayStat {
  day: string; 
  statuses: Partial<Record<TaskStatus, number>>;
}

export interface CalendarStatsResponse {
  daily: DayStat[];
  totals: Partial<Record<TaskStatus, number>>;
  total_tasks: number;
  done_tasks: number;
  overdue_tasks: number;
}

export interface ProjectTaskCount {
  project_id: string;
  project_name: string;
  tasks_count: number;
}

export interface ProjectOption {
  id: string;
  name: string;
}

export interface StatusOption {
  value: TaskStatus;
  label: string;
}

export interface CalendarStatsRequest {
  p_start_date: string | Date;
  p_end_date: string | Date;
  p_project_id: string | null;
  p_status: TaskStatus | null;
}

export interface ProjectCountRequest {
  p_start_date: string | Date;
  p_end_date: string | Date;
}

export const STATUS_ORDER: TaskStatus[] = [
  'TO_DO',
  'IN_PROGRESS',
  'BLOCKED',
  'IN_REVIEW',
  'READY_FOR_QA',
  'REOPENED',
  'READY_FOR_PRODUCTION',
  'DONE',
];

export function statusLabel(status: any): string {
  return status.replace(/_/g, ' ');
}

export const STATUS_OPTIONS: StatusOption[] = STATUS_ORDER.map((value) => ({
  value,
  label: statusLabel(value),
}));

export interface ProjectRow {
  project_id: string;
  project_name: string;
  tasks_count: number;
}

export interface SummaryCard {
  label: string;
  value: number;
  iconBg: string;
  iconColor: string;
  valueColor: string;
  icon: 'clipboard' | 'check' | 'warning';
}