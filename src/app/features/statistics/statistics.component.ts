import { Component, computed, DestroyRef, HostListener, OnInit, signal } from '@angular/core';
import { IconComponent } from '../../shared/icons/icon.component';
import {
  CalendarStatsResponse,
  ProjectRow,
  STATUS_OPTIONS,
  STATUS_ORDER,
  statusLabel,
  SummaryCard,
  TaskStatus,
} from './statistics.model';
import { CalenderComponent, DateRange } from './calender/calender.component';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { DatePipe, KeyValuePipe, NgClass } from '@angular/common';
import { WarningIconComponent } from '../../shared/icons';
import { ProjectService } from '../project/project.service';
import { StatisticsService } from './statistics.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

function getWeekRange(date: Date): DateRange {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
}

function formatRange(range: DateRange): string {
  return `${range.start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} - ${range.end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    IconComponent,
    CalenderComponent,
    ClickOutsideDirective,
    NgClass,
    WarningIconComponent,
    KeyValuePipe,
    DatePipe,
    NgClass,
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent implements OnInit {
  STATUS_OPTIONS = STATUS_OPTIONS;

  isLoading = false;
  isMobile = window.innerWidth < 768;
  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  projectOptions: any = [];
  projects: ProjectRow[] = [];

  selectedProject = this.projectOptions[0];

  selectedProjectId = '';
  selectedStatus = '';

  totalTasks = '';

  summaryCard: SummaryCard[] = [
    {
      label: this.isMobile ? 'TOTAL TASKS' : 'TOTAL TASKS',
      value: 0,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      valueColor: 'text-slate-900',
      icon: 'clipboard',
    },
    {
      label: this.isMobile ? 'COMPLETED' : 'COMPLETED TASKS',
      value: 0,
      iconBg: 'bg-[#0068441A]',
      iconColor: 'text-emerald-600',
      valueColor: 'text-slate-900',
      icon: 'check',
    },
    {
      label: this.isMobile ? 'OVERDUE' : 'OVERDUE TASKS',
      value: 0,
      iconBg: 'bg-[#FFDAD633]',
      iconColor: 'text-red-700',
      valueColor: 'text-red-700',
      icon: 'warning',
    },
  ];

  constructor(
    private statisticsService: StatisticsService,
    private projectService: ProjectService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.projectService
      .getProjectOptions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(options => {
        this.projectOptions = options;
      });
    this.loadStats();
  }

  isProjectsOpen = false;
  isStatusesOpen = false;
  isOpenCalender = false;

  weekRange = signal<DateRange>(getWeekRange(new Date()));
  fullDate = computed(() => formatRange(this.weekRange()));
  startDate = computed(() => this.weekRange().start);
  endDate = computed(() => this.weekRange().end);

  statuses = STATUS_ORDER;
  statusLabelFn = statusLabel;
  calendarData = signal<CalendarStatsResponse | null>(null);

  private splitDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

  private loadStats() {
    this.isLoading = true;

    const calendarRequest = {
      p_start_date: this.splitDate(this.startDate()),
      p_end_date: this.splitDate(this.endDate()),
      p_project_id: this.selectedProjectId || null,
      p_status: this.selectedStatus || null,
    };

    const projectRequest = {
      p_start_date: this.startDate(),
      p_end_date: this.endDate(),
    };

    this.statisticsService
      .getCalendarStats(calendarRequest)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          console.log(response);
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
          this.projects = response;
        },
      });
  }

  isToday(date: Date | string): boolean {
    const today = new Date();
    const d = typeof date === 'string' ? new Date(date) : date;
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  }

  private applyCalendarStats(response: any) {
    this.isLoading = false;

    this.summaryCard[0].value = response.total_tasks;
    this.summaryCard[1].value = response.done_tasks;
    this.summaryCard[2].value = response.overdue_tasks;
    this.totalTasks = response.total_tasks;

    this.calendarData.set(response);
  }

  onProjectChange(id: string) {
    this.selectedProjectId = id;
    this.selectedProject = this.projectOptions.find((p: any) => p.id === id);
    this.loadStats();
  }
  onStatusChange(value: string) {
    this.selectedStatus = value;
    this.loadStats();
  }

  onRangeSelected(range: DateRange): void {
    this.weekRange.set(range);
    this.isOpenCalender = false;
    this.loadStats();
  }

  cancel() {
    this.isOpenCalender = false;
  }
  statusColors: Record<TaskStatus, string> = {
    TO_DO: '#94A3B8',
    IN_PROGRESS: '#003D9B',
    BLOCKED: '#BA1A1A',
    IN_REVIEW: '#8B5CF6',
    READY_FOR_QA: '#F59E0B',
    REOPENED: '#F97316',
    READY_FOR_PRODUCTION: '#06B6D4',
    DONE: '#004E32',
  };

  statusConfigs = computed(() => {
    const data = this.calendarData();

    if (!data || !data.total_tasks || !data.totals) {
      return [];
    }

    return this.statuses
      .filter(status => (data.totals?.[status] ?? 0) > 0)
      .map(status => {
        const value = data.totals[status] ?? 0;

        return {
          key: status,
          value,
          color: this.statusColors[status],
          percentage: (value / data.total_tasks) * 100,
        };
      });
  });

  chartGradient = computed(() => {
    const configs = this.statusConfigs();

    if (!configs.length) {
      return '#E5E7EB';
    }

    let current = 0;

    const gradients = configs.map(status => {
      const start = current;
      const end = current + status.percentage;

      current = end;

      return `${status.color} ${start}% ${end}%`;
    });

    return `conic-gradient(${gradients.join(', ')})`;
  });
}
