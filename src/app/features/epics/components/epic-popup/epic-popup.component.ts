import { Component } from '@angular/core';
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { DateIconComponent } from "../../../../shared/icons";

@Component({
  selector: 'app-epic-popup',
  standalone: true,
  imports: [ModalComponent, DateIconComponent],
  templateUrl: './epic-popup.component.html',
  styleUrl: './epic-popup.component.css'
})
export class EpicPopupComponent {
  showEpicModal = false;
}
