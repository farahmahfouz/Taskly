import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProjectService } from '../project/project.service';
import { StatisticsService } from './statistics.service';
import {
  CalendarStatsResponse,
  MAX_RANGE_DAYS,
  ProjectOption,
  STATUS_OPTIONS,
  STATUS_ORDER,
  STATUS_STYLES,
  TaskStatus,
  statusLabel,
} from './statistics.model';
import {
  DayCard,
  DonutSegment,
  LegendItem,
  ProjectRow,
  StatusPill,
  SummaryCard,
} from './statistics.model';
import { StatisticsToolbarComponent } from './components/statistics-toolbar/statistics-toolbar.component';
import { SummaryCardsComponent } from './components/summary-cards/summary-cards.component';
import { WeekCalendarComponent } from './components/week-calendar/week-calendar.component';
import { StatusDonutChartComponent } from './components/status-donut-chart/status-donut-chart.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { AppliedRange } from './components/date-range-picker/date-range-picker.component';

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function getRangeEnd(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getRangeStart(end: Date): Date {
  return addDays(end, -(MAX_RANGE_DAYS - 1));
}

function formatDateRange(start: Date, end: Date): string {
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${startStr} - ${endStr}`;
}

function daysBetweenInclusive(start: Date, end: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((end.getTime() - start.getTime()) / msPerDay) + 1;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    StatisticsToolbarComponent,
    SummaryCardsComponent,
    WeekCalendarComponent,
    StatusDonutChartComponent,
    ProjectsListComponent,
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent implements OnInit {
  readonly statusOptions = STATUS_OPTIONS;
  readonly maxRangeDays = MAX_RANGE_DAYS;

  endDate = getRangeEnd(new Date());
  startDate = getRangeStart(this.endDate);

  selectedProjectId = '';
  selectedStatus = '';

  projectOptions: any = [];
  rangeError: string | null = null;
  showDatePicker = false;
  isLoading = false;

  summaryCards: SummaryCard[] = [
    {
      label: 'TOTAL TASKS',
      value: 0,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      valueColor: 'text-slate-900',
      icon: 'clipboard',
    },
    {
      label: 'COMPLETED TASKS',
      value: 0,
      iconBg: 'bg-[#0068441A]',
      iconColor: 'text-emerald-600',
      valueColor: 'text-slate-900',
      icon: 'check',
    },
    {
      label: 'OVERDUE TASKS',
      value: 0,
      iconBg: 'bg-[#FFDAD633]',
      iconColor: 'text-red-700',
      valueColor: 'text-red-700',
      icon: 'warning',
    },
  ];

  days: DayCard[] = [];
  legend: LegendItem[] = [];
  totalTasks = 0;
  donutCircumference = 345.6;
  donutSegments: DonutSegment[] = [];
  projects: ProjectRow[] = [];

  constructor(
    private statisticsService: StatisticsService,
    private projectService: ProjectService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit() {
    this.projectService
      .getProjectOptions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(options => {
        this.projectOptions = options;  
      });

    this.refreshDayCards();
    this.loadStats();
  }

  get dateRange(): string {
    return formatDateRange(this.startDate, this.endDate);
  }

  get startDateISO(): string {
    return toISODate(this.startDate);
  }

  get endDateISO(): string {
    return toISODate(this.endDate);
  }

  get isRangeValid(): boolean {
    return this.rangeError === null;
  }

  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  closeDatePicker() {
    this.showDatePicker = false;
  }

  prevWeek() {
    this.startDate = addDays(this.startDate, -MAX_RANGE_DAYS);
    this.endDate = addDays(this.endDate, -MAX_RANGE_DAYS);
    this.rangeError = null;
    this.refreshDayCards();
    this.loadStats();
  }

  nextWeek() {
    this.startDate = addDays(this.startDate, MAX_RANGE_DAYS);
    this.endDate = addDays(this.endDate, MAX_RANGE_DAYS);
    this.rangeError = null;
    this.refreshDayCards();
    this.loadStats();
  }

  onRangeApply(range: AppliedRange) {
    const start = parseISODate(range.start);
    const end = parseISODate(range.end);
    this.applyDateRange(start, end);
    this.closeDatePicker();
  }

  onProjectChange(value: string) {
    this.selectedProjectId = value;
    this.loadStats();
  }

  onStatusChange(value: string) {
    this.selectedStatus = value;
    this.loadStats();
  }

  private applyDateRange(start: Date, end: Date) {
    if (!this.validateRange(start, end)) return;

    this.startDate = start;
    this.endDate = end;
    this.refreshDayCards();
    this.loadStats();
  }

  private validateRange(start: Date, end: Date): boolean {
    if (end < start) {
      this.rangeError = 'End date must be on or after the start date.';
      return false;
    }

    if (daysBetweenInclusive(start, end) > MAX_RANGE_DAYS) {
      this.rangeError = `Date range cannot exceed ${MAX_RANGE_DAYS} days.`;
      return false;
    }

    this.rangeError = null;
    return true;
  }

  private loadStats() {
    if (!this.isRangeValid) return;

    this.isLoading = true;

    const calendarRequest = {
      p_start_date: toISODate(this.startDate),
      p_end_date: toISODate(this.endDate),
      p_project_id: this.selectedProjectId || null,
      p_status: (this.selectedStatus as TaskStatus) || null,
    };

    const projectRequest = {
      p_start_date: toISODate(this.startDate),
      p_end_date: toISODate(this.endDate),
    };

    this.statisticsService
      .getCalendarStats(calendarRequest)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.applyCalendarStats(response);
        },
        error: () => {
          this.isLoading = false;
        },
      });

    this.statisticsService
      .getTasksPerProject(projectRequest)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.projects = response.map(p => ({
            name: p.project_name,
            tasks: p.tasks_count,
          }));
        },
      });
  }

  private refreshDayCards() {
    this.days = this.buildDayCards({
      daily: [],
      totals: {},
      total_tasks: 0,
      done_tasks: 0,
      overdue_tasks: 0,
    });
  }

  private applyCalendarStats(response: CalendarStatsResponse) {
    this.isLoading = false;

    this.summaryCards[0].value = response.total_tasks;
    this.summaryCards[1].value = response.done_tasks;
    this.summaryCards[2].value = response.overdue_tasks;
    this.totalTasks = response.total_tasks;

    this.days = this.buildDayCards(response);
    this.legend = this.buildLegend(response);
    this.donutSegments = this.buildDonutSegments(response.totals, response.total_tasks);
  }

  private buildDayCards(response: CalendarStatsResponse): DayCard[] {
    const statsByDay = new Map(response.daily.map(d => [d.day, d]));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cards: DayCard[] = [];
    let cursor = new Date(this.startDate);

    while (cursor <= this.endDate) {
      const iso = toISODate(cursor);
      const dayStat = statsByDay.get(iso);
      const pills: StatusPill[] = STATUS_ORDER.filter(s => (dayStat?.statuses[s] ?? 0) > 0).map(
        s => ({
          label: statusLabel(s),
          count: dayStat!.statuses[s]!,
          classes: STATUS_STYLES[s].pill,
        }),
      );

      cards.push({
        name: cursor.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        date: cursor.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        isToday: cursor.getTime() === today.getTime(),
        pills,
      });

      cursor = addDays(cursor, 1);
    }

    return cards;
  }

  private buildLegend(response: CalendarStatsResponse): LegendItem[] {
    return STATUS_ORDER.filter(s => (response.totals[s] ?? 0) > 0).map(s => ({
      name: statusLabel(s),
      count: response.totals[s]!,
      dotColor: STATUS_STYLES[s].dot,
      barColor: STATUS_STYLES[s].chart,
    }));
  }

  private buildDonutSegments(
    totals: Partial<Record<TaskStatus, number>>,
    total: number,
  ): DonutSegment[] {
    if (total === 0) return [];

    let rotation = -90;
    return STATUS_ORDER.filter(s => (totals[s] ?? 0) > 0).map(s => {
      const fraction = totals[s]! / total;
      const dash = fraction * this.donutCircumference;
      const segment = { color: STATUS_STYLES[s].chart, dash, rotate: rotation };
      rotation += fraction * 360;
      return segment;
    });
  }
}
