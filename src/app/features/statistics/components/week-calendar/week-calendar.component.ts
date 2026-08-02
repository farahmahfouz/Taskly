import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DayCard } from '../../statistics.model';

@Component({
  selector: 'app-week-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './week-calendar.component.html',
})
export class WeekCalendarComponent {
  @Input() days: DayCard[] = [];
}
