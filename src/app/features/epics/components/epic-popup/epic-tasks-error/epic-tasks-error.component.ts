import { Component, output } from '@angular/core';

@Component({
  selector: 'app-epic-tasks-error',
  standalone: true,
  imports: [],
  templateUrl: './epic-tasks-error.component.html',
  styleUrl: './epic-tasks-error.component.css'
})
export class EpicTasksErrorComponent {
  retry = output<void>();
}
