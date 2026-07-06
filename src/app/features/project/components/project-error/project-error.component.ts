import { Component, EventEmitter, Output } from '@angular/core';
import { DisconnectIconComponent } from '../../../../shared/icons/disconnect-icon.component';

@Component({
  selector: 'app-project-error',
  standalone: true,
  imports: [DisconnectIconComponent],
  templateUrl: './project-error.component.html',
  styleUrl: './project-error.component.css',
})
export class ProjectErrorComponent {
  @Output() retry = new EventEmitter<void>();
}
