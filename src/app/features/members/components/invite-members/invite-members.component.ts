import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { CloseIconComponent } from '../../../../shared/icons';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ModalMobileComponent } from "../../../../shared/components/modal-mobile/modal-mobile.component";

@Component({
  selector: 'app-invite-members',
  standalone: true,
  imports: [ModalComponent, CloseIconComponent, InputComponent, ModalMobileComponent],
  templateUrl: './invite-members.component.html',
  styleUrl: './invite-members.component.css',
})
export class InviteMembersComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  isMobile = window.innerWidth < 768;

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }
}
