import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-mobile',
  standalone: true,
  imports: [],
  templateUrl: './modal-mobile.component.html',
  styleUrl: './modal-mobile.component.css',
})
export class ModalMobileComponent {
  @Input() isOpen = false;

  @Output() close = new EventEmitter<void>();
}
