import { Component, output } from '@angular/core';
import { TaskListIconComponent } from '../../../../../shared/icons';

@Component({
  selector: 'app-epic-tasks-empty',
  standalone: true,
  imports: [TaskListIconComponent],
  templateUrl: './epic-tasks-empty.component.html',
  styleUrl: './epic-tasks-empty.component.css',
})
export class EpicTasksEmptyComponent {
  goToTasks = output<void>();
}
