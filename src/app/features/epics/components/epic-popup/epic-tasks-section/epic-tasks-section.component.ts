import { Component, Input, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { InitialsPipe } from '../../../../../shared/pipes/initials.pipe';
import { Task } from '../../../../tasks/task.constants';

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
}
