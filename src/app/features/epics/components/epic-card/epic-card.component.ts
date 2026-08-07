import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Epic } from '../../epic.model';
import { DatePipe } from '@angular/common';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { IconComponent } from '../../../../shared/icons/icon.component';

@Component({
  selector: 'app-epic-card',
  standalone: true,
  imports: [DatePipe, IconComponent, InitialsPipe],
  templateUrl: './epic-card.component.html',
  styleUrl: './epic-card.component.css',
})
export class EpicCardComponent {
  @Input({ required: true }) epic!: Epic;

  @Output() open = new EventEmitter<string>();

  openEpic() {
    this.open.emit(this.epic.id);
  }
}
