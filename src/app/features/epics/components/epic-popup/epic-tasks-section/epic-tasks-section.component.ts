import { Component, Input, input, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { InitialsPipe } from '../../../../../shared/pipes/initials.pipe';
import { Task } from '../../../../tasks/task.constants';
import { OpenPopupService } from '../../../../../core/services/open-popup.service';

@Component({
  selector: 'app-epic-tasks-section',
  standalone: true,
  imports: [DatePipe, InitialsPipe],
  templateUrl: './epic-tasks-section.component.html',
  styleUrl: './epic-tasks-section.component.css',
})
export class EpicTasksSectionComponent {
  task = input.required<Task>();
  @Input() last = false;

  private openPopupService = inject(OpenPopupService);

  onRowClick(task: Task) {
    this.openPopupService.open(task.id);
  }
}
