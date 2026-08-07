import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../../icons/icon.component';


@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css'
})
export class ErrorPageComponent {
  @Input() message = 'Something went wrong';
  @Output() retry = new EventEmitter<void>();
}
