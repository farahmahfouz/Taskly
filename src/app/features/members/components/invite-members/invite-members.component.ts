import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { CloseIconComponent } from "../../../../shared/icons";
import { InputComponent } from "../../../../shared/components/input/input.component";

@Component({
  selector: 'app-invite-members',
  standalone: true,
  imports: [ModalComponent, CloseIconComponent, InputComponent],
  templateUrl: './invite-members.component.html',
  styleUrl: './invite-members.component.css',
})
export class InviteMembersComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
}
