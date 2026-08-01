import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectOption, StatusOption} from '../../statistics.model';

@Component({
  selector: 'app-statistics-toolbar',
  standalone: true,
  imports: [CommonModule],
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
  @Output() startDateChange = new EventEmitter<string>();
  @Output() endDateChange = new EventEmitter<string>();
  @Output() projectChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<string>();

  onStartDateChange(event: Event) {
    this.startDateChange.emit((event.target as HTMLInputElement).value);
  }

  onEndDateChange(event: Event) {
    this.endDateChange.emit((event.target as HTMLInputElement).value);
  }

  onProjectChange(event: Event) {
    this.projectChange.emit((event.target as HTMLSelectElement).value);
  }

  onStatusChange(event: Event) {
    this.statusChange.emit((event.target as HTMLSelectElement).value);
  }
}
