import { Epic } from '../epics/epic.model';

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

export interface TaskStatusConfig {
  value: TaskStatus;
  label: string;
  dotColor: string;
  badgeClass: string;
  cardClass: string;
  dateClass: string;
  icon: 'date' | 'warning';
}

export const TASK_STATUSES: TaskStatusConfig[] = [
  {
    value: 'TO_DO',
    label: 'TO DO',
    dotColor: 'bg-neutral-light',
    badgeClass: 'bg-surface-highest text-neutral-dark',
    cardClass: 'bg-white border border-[#C3C6D61A]',
    dateClass: 'text-[#94A3B8]',
    icon: 'date',
  },
  {
    value: 'IN_PROGRESS',
    label: 'IN PROGRESS',
    dotColor: 'bg-primary',
    badgeClass: 'bg-surface-highest text-neutral-dark',
    cardClass: 'bg-white border-l-3 border-primary',
    dateClass: 'text-primary',
    icon: 'date',
  },
  {
    value: 'BLOCKED',
    label: 'BLOCKED',
    dotColor: 'bg-error',
    badgeClass: 'bg-[#FFDAD6] text-error',
    cardClass: 'bg-[#FFDAD633] border border-[#BA1A1A1A]',
    dateClass: 'text-error',
    icon: 'warning',
  },
  {
    value: 'IN_REVIEW',
    label: 'IN REVIEW',
    dotColor: 'bg-green-500',
    badgeClass: 'bg-surface-highest text-neutral-dark',
    cardClass: 'bg-white border border-[#C3C6D61A]',
    dateClass: 'text-[#94A3B8]',
    icon: 'date',
  },
  {
    value: 'READY_FOR_QA',
    label: 'READY FOR QA',
    dotColor: 'bg-yellow-500',
    badgeClass: 'bg-surface-highest text-neutral-dark',
    cardClass: 'bg-white border border-[#C3C6D61A]',
    dateClass: 'text-[#94A3B8]',
    icon: 'date',
  },
  {
    value: 'REOPENED',
    label: 'REOPENED',
    dotColor: 'bg-orange-500',
    badgeClass: 'bg-surface-highest text-neutral-dark',
    cardClass: 'bg-white border border-[#C3C6D61A]',
    dateClass: 'text-[#94A3B8]',
    icon: 'date',
  },
  {
    value: 'READY_FOR_PRODUCTION',
    label: 'READY FOR PRODUCTION',
    dotColor: 'bg-cyan-500',
    badgeClass: 'bg-surface-highest text-neutral-dark',
    cardClass: 'bg-white border border-[#C3C6D61A]',
    dateClass: 'text-[#94A3B8]',
    icon: 'date',
  },
  {
    value: 'DONE',
    label: 'DONE',
    dotColor: 'bg-green-600',
    badgeClass: 'bg-green-100 text-green-700',
    cardClass: 'bg-white border border-[#C3C6D61A]',
    dateClass: 'text-green-600',
    icon: 'date',
  },
];

export interface CreateTaskRequest {
  project_id: string;
  epic_id?: string;
  title: string;
  description?: string;
  assignee_id?: string;
  due_date?: string;
  status: TaskStatus;
}

export interface Task {
  id: string;
  task_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  due_date: string;
  created_at: string;
  project_id: string;
  epic_id: string;

  assignee: User;
  created_by: User;
  epic: Epic;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
}
