// statistics-toolbar.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectOption, StatusOption } from '../../statistics.model';
import { AppliedRange } from '../date-range-picker/date-range-picker.component';
import { DateRangePickerComponent } from '../date-range-picker/date-range-picker.component';

@Component({
  selector: 'app-statistics-toolbar',
  standalone: true,
  imports: [CommonModule, DateRangePickerComponent],
  templateUrl: './statistics-toolbar.component.html',
})
export class StatisticsToolbarComponent {
  @Input() dateRange = '';
  @Input() rangeError: string | null = null;
  @Input() showDatePicker = false;
  @Input() startDateISO = '';
  @Input() endDateISO = '';
  @Input() maxRangeDays = 7;
  @Input() projectOptions: ProjectOption[] = [];
  @Input() selectedProjectId = '';
  @Input() statusOptions: StatusOption[] = [];
  @Input() selectedStatus = '';

  @Output() prevWeek = new EventEmitter<void>();
  @Output() nextWeek = new EventEmitter<void>();
  @Output() toggleDatePicker = new EventEmitter<void>();
  @Output() closeDatePicker = new EventEmitter<void>();
  @Output() rangeApply = new EventEmitter<AppliedRange>();
  @Output() projectChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<string>();

  onRangeApply(range: AppliedRange) {
    this.rangeApply.emit(range);
    this.closeDatePicker.emit(); // Close picker after applying
  }

  onProjectChange(event: Event) {
    this.projectChange.emit((event.target as HTMLSelectElement).value);
  }

  onStatusChange(event: Event) {
    this.statusChange.emit((event.target as HTMLSelectElement).value);
  }
}