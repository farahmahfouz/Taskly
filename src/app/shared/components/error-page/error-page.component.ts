import { Component, EventEmitter, Output } from '@angular/core';
import { DisconnectIconComponent } from '../../icons/disconnect-icon.component';


@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [DisconnectIconComponent],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css'
})
export class ErrorPageComponent {
  @Output() retry = new EventEmitter<void>();
}
