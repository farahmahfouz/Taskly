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
  p_start_date: string;
  p_end_date: string;
  p_project_id: string | null;
  p_status: TaskStatus | null;
}

export interface ProjectCountRequest {
  p_start_date: string;
  p_end_date: string;
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

export function statusLabel(status: TaskStatus): string {
  return status.replace(/_/g, ' ');
}

export const STATUS_OPTIONS: StatusOption[] = STATUS_ORDER.map((value) => ({
  value,
  label: statusLabel(value),
}));

export interface StatusStyle {
  dot: string; 
  pill: string; 
  chart: string; 
}

export const STATUS_STYLES: Record<TaskStatus, StatusStyle> = {
  TO_DO: { dot: 'bg-[#8A90A3]', pill: 'bg-[#F1F2F6] text-[#5B6072]', chart: '#E8EDFF' },
  IN_PROGRESS: { dot: 'bg-[#0052CC]', pill: 'bg-[#E6EFFF] text-[#0052CC]', chart: '#003d9b' },
  BLOCKED: { dot: 'bg-[#BA1A1A]', pill: 'bg-[#BA1A1A] text-[#DE350B]', chart: '#BA1A1A' },
  IN_REVIEW: { dot: 'bg-[#9F62F2]', pill: 'bg-[#F2EBFE] text-[#7E3FE0]', chart: '#9F62F2' },
  READY_FOR_QA: { dot: 'bg-[#FFAB00]', pill: 'bg-[#FFF6E0] text-[#B67900]', chart: '#FFAB00' },
  REOPENED: { dot: 'bg-[#FF7452]', pill: 'bg-[#FFECE6] text-[#C23F1F]', chart: '#FF7452' },
  READY_FOR_PRODUCTION: { dot: 'bg-[#00B8D9]', pill: 'bg-[#E3FAFC] text-[#007A8C]', chart: '#00B8D9' },
  DONE: { dot: 'bg-[#004E32]', pill: 'bg-[##004E32] text-[#004E32]', chart: '#004E32' },
};

export const MAX_RANGE_DAYS = 7;

export interface StatusPill {
  label: string;
  count: number;
  classes: string;
}

export interface DayCard {
  name: string;
  date: string;
  isToday: boolean;
  pills: StatusPill[];
}

export interface LegendItem {
  name: string;
  count: number;
  dotColor: string;
  barColor: string;
}

export interface ProjectRow {
  name: string;
  tasks: number;
}

export interface SummaryCard {
  label: string;
  value: number;
  iconBg: string;
  iconColor: string;
  valueColor: string;
  icon: 'clipboard' | 'check' | 'warning';
}

export interface DonutSegment {
  color: string;
  dash: number;
  rotate: number;
}
