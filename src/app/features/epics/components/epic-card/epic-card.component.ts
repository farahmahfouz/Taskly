import { Component, Input } from '@angular/core';
import { Epic } from '../../epic.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-epic-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './epic-card.component.html',
  styleUrl: './epic-card.component.css'
})
export class EpicCardComponent {
  @Input({ required: true }) epic!: Epic;
}
