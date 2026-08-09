import { DatePipe } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';

export interface DateRange {
  start: Date;
  end: Date;
}

const MAX_RANGE_DAYS = 7;

@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.css',
})
export class CalenderComponent {
  selectedRange = input<DateRange | null>(null);

  rangeSelected = output<DateRange>();
  cancelled = output<void>();

  currentMonth = signal<number>(new Date().getMonth());
  currentYear = signal<number>(new Date().getFullYear());

  rangeStart = signal<Date | null>(null);
  rangeEnd = signal<Date | null>(null);
  errorMessage = signal<string | null>(null);

  viewDate = computed(() => new Date(this.currentYear(), this.currentMonth(), 1));

  days = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();

    const firstDayOfMonths = new Date(year, month, 1);
    const lastDayOfMonths = new Date(year, month + 1, 0);

    const startDay = firstDayOfMonths.getDay();
    const totalDays = lastDayOfMonths.getDate();

    const result: Date[] = [];

    for (let i = startDay; i > 0; i--) {
      result.push(new Date(year, month, 1 - i));
    }

    for (let i = 1; i <= totalDays; i++) {
      result.push(new Date(year, month, i));
    }

    const remainingDays = 42 - result.length;
    for (let i = 1; i <= remainingDays; i++) {
      result.push(new Date(year, month + 1, i));
    }

    return result;
  });
  constructor() {
    effect(
      () => {
        const range = this.selectedRange();
        if (range) {
          this.currentMonth.set(range.start.getMonth());
          this.currentYear.set(range.start.getFullYear());
          this.rangeStart.set(range.start);
          this.rangeEnd.set(range.end);
        }
      },
      { allowSignalWrites: true },
    );
  }

  changeMonth(delta: number): void {
    let month = this.currentMonth() + delta;
    let year = this.currentYear();
    if (month < 0) {
      month = 11;
      year--;
    } else if (month > 11) {
      month = 0;
      year++;
    }
    this.currentMonth.set(month);
    this.currentYear.set(year);
  }

  selectDay(date: Date): void {
    const start = this.rangeStart();
    const end = this.rangeEnd();

    if (!start || (start && end)) {
      this.rangeStart.set(date);
      this.rangeEnd.set(null);
      this.errorMessage.set(null);
      return;
    }

    const rangeStartDate = date < start ? date : start;
    const rangeEndDate = date < start ? start : date;

    const diffDays =
      Math.round(
        (this.stripTime(rangeEndDate).getTime() - this.stripTime(rangeStartDate).getTime()) /
          (1000 * 60 * 60 * 24),
      ) + 1;

    if (diffDays > MAX_RANGE_DAYS) {
      this.errorMessage.set(`Max range is ${MAX_RANGE_DAYS} days`);
      return; 
    }

    this.rangeStart.set(rangeStartDate);
    this.rangeEnd.set(rangeEndDate);
    this.errorMessage.set(null);
  }

  isInRange(date: Date): boolean {
    const start = this.rangeStart(),
      end = this.rangeEnd();
    if (!start || !end) return false;
    const d = this.stripTime(date).getTime();
    return d >= this.stripTime(start).getTime() && d <= this.stripTime(end).getTime();
  }

  isRangeStart(date: Date): boolean {
    const start = this.rangeStart();
    if (!start) return false;
    return this.stripTime(date).getTime() === this.stripTime(start).getTime();
  }

  isRangeEnd(date: Date): boolean {
    const end = this.rangeEnd();
    if (!end) return false;
    return this.stripTime(date).getTime() === this.stripTime(end).getTime();
  }

  private stripTime(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  onApply(): void {
    const start = this.rangeStart(),
      end = this.rangeEnd();
    if (start && end) this.rangeSelected.emit({ start, end });
  }
  onCancel(): void {
    this.cancelled.emit();
  }
}
