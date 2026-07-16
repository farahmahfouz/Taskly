import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Epic } from '../../epic.model';
import { DatePipe } from '@angular/common';
import { EditIconComponent } from '../../../../shared/icons/edit-icon.component';
import { PeopleIconComponent, DateIconComponent } from '../../../../shared/icons';
import { getInitials } from '../../../../core/utils/getInitials';

@Component({
  selector: 'app-epic-card',
  standalone: true,
  imports: [DatePipe, EditIconComponent, PeopleIconComponent, DateIconComponent],
  templateUrl: './epic-card.component.html',
  styleUrl: './epic-card.component.css',
})
export class EpicCardComponent {
  @Input({ required: true }) epic!: Epic;

  @Output() open = new EventEmitter<string>();

  getInitials = getInitials;

  openEpic() {
    this.open.emit(this.epic.id);
  }
}
