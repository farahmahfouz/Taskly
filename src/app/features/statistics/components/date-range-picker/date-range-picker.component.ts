// date-range-picker.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
}

export interface AppliedRange {
  start: string; // ISO yyyy-MM-dd
  end: string;   // ISO yyyy-MM-dd
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

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

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function daysBetweenInclusive(start: Date, end: Date): number {
  const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endMidnight = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endMidnight.getTime() - startMidnight.getTime()) / MS_PER_DAY) + 1;
}

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-range-picker.component.html',
})
export class DateRangePickerComponent implements OnInit {
  @Input() startDateISO = '';
  @Input() endDateISO = '';
  @Input() maxRangeDays = 7;

  @Output() apply = new EventEmitter<AppliedRange>();
  @Output() cancel = new EventEmitter<void>();

  tempStart: Date | null = null;
  tempEnd: Date | null = null;
  errorMessage: string | null = null;

  viewYear!: number;
  viewMonth!: number; // 0-11

  weekdayLabels = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  calendarDays: CalendarDay[] = [];

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  ngOnInit(): void {
    // Default to current week (start = today, end = today + 6 days)
    const today = new Date();
    const defaultStart = this.startDateISO ? parseISODate(this.startDateISO) : today;
    const defaultEnd = this.endDateISO ? parseISODate(this.endDateISO) : new Date(today.getTime() + 6 * MS_PER_DAY);

    this.tempStart = defaultStart;
    this.tempEnd = defaultEnd;
    this.viewYear = defaultStart.getFullYear();
    this.viewMonth = defaultStart.getMonth();

    this.buildCalendar();
  }

  get viewMonthLabel(): string {
    return `${this.monthNames[this.viewMonth]} ${this.viewYear}`;
  }

  prevMonth(): void {
    this.viewMonth--;
    if (this.viewMonth < 0) {
      this.viewMonth = 11;
      this.viewYear--;
    }
    this.buildCalendar();
  }

  nextMonth(): void {
    this.viewMonth++;
    if (this.viewMonth > 11) {
      this.viewMonth = 0;
      this.viewYear++;
    }
    this.buildCalendar();
  }

  selectDay(day: CalendarDay): void {
    this.errorMessage = null;

    const startingFreshSelection = !this.tempStart || (this.tempStart && this.tempEnd);

    if (startingFreshSelection) {
      this.tempStart = day.date;
      this.tempEnd = null;
      return;
    }

    let start = this.tempStart as Date;
    let end = day.date;

    if (end.getTime() < start.getTime()) {
      [start, end] = [end, start];
    }

    if (daysBetweenInclusive(start, end) > this.maxRangeDays) {
      this.errorMessage = `Date range cannot exceed ${this.maxRangeDays} days.`;
      return;
    }

    this.tempStart = start;
    this.tempEnd = end;
  }

  isRangeMember(day: CalendarDay): boolean {
    if (this.tempStart && this.tempEnd) {
      return day.date.getTime() >= this.tempStart.getTime() && day.date.getTime() <= this.tempEnd.getTime();
    }
    if (this.tempStart && !this.tempEnd) {
      return isSameDay(day.date, this.tempStart);
    }
    return false;
  }

  // Helper to determine if this cell is the left edge of a range block
  private isLeftEdge(index: number): boolean {
    const colIndex = index % 7;
    if (colIndex === 0) return true;
    const prev = this.calendarDays[index - 1];
    return !prev || !this.isRangeMember(prev);
  }

  // Helper to determine if this cell is the right edge of a range block
  private isRightEdge(index: number): boolean {
    const colIndex = index % 7;
    if (colIndex === 6) return true;
    const next = this.calendarDays[index + 1];
    return !next || !this.isRangeMember(next);
  }

  dayClasses(day: CalendarDay, index: number): string {
    let classes = 'h-8 text-xs font-regular flex items-center justify-center rounded-[1px] transition-colors';

    // Today (priority)
    if (day.isToday) {
      return `${classes} bg-[#d7e2ff] text-[#003d9b]`;
    }

    // Range member
    if (this.isRangeMember(day)) {
      const isLeft = this.isLeftEdge(index);
      const isRight = this.isRightEdge(index);

      // Background & text
      let rangeClasses = 'bg-blue-50 text-gray-800';

      // Rounded edges: full round for single-day range, else rounded on the appropriate side
      if (isLeft && isRight) {
        rangeClasses += ' rounded-[1px]';
      } else if (isLeft) {
        rangeClasses += ' rounded-l-[1px] rounded-r-none';
      } else if (isRight) {
        rangeClasses += ' rounded-r-[1px] rounded-l-none';
      } else {
        rangeClasses += ' rounded-none';
      }

      return `${classes} ${rangeClasses}`;
    }

    // Default: in-month or out-of-month
    const textColor = day.inCurrentMonth ? 'text-gray-800' : 'text-gray-300';
    return `${classes} ${textColor}`;
  }

  applyClick(): void {
    if (!this.tempStart || !this.tempEnd) {
      this.errorMessage = 'Pick a start and end date.';
      return;
    }
    this.apply.emit({ start: toISODate(this.tempStart), end: toISODate(this.tempEnd) });
  }

  cancelClick(): void {
    this.cancel.emit();
  }

  private buildCalendar(): void {
    const firstOfMonth = new Date(this.viewYear, this.viewMonth, 1);
    const jsWeekday = firstOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
    const mondayFirstOffset = (jsWeekday + 6) % 7;

    const gridStart = new Date(firstOfMonth);
    gridStart.setDate(gridStart.getDate() - mondayFirstOffset);

    const today = new Date();
    const days: CalendarDay[] = [];

    for (let i = 0; i < 42; i++) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + i);

      days.push({
        date,
        dayNumber: date.getDate(),
        inCurrentMonth: date.getMonth() === this.viewMonth,
        isToday: isSameDay(date, today),
      });
    }

    this.calendarDays = days;
  }
}