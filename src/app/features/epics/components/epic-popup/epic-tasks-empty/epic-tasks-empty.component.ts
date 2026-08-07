import { Component, output } from '@angular/core';
import { IconComponent } from '../../../../../shared/icons/icon.component';

@Component({
  selector: 'app-epic-tasks-empty',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './epic-tasks-empty.component.html',
  styleUrl: './epic-tasks-empty.component.css',
})
export class EpicTasksEmptyComponent {
  goToTasks = output<void>();
}
