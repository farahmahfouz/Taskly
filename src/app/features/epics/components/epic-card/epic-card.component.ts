import { Component, Input } from '@angular/core';
import { Epic } from '../../epic.model';
import { DatePipe } from '@angular/common';
import { EditIconComponent } from "../../../../shared/icons/edit-icon.component";
import { PeopleIconComponent, DateIconComponent } from "../../../../shared/icons";

@Component({
  selector: 'app-epic-card',
  standalone: true,
  imports: [DatePipe, EditIconComponent, PeopleIconComponent, DateIconComponent],
  templateUrl: './epic-card.component.html',
  styleUrl: './epic-card.component.css'
})
export class EpicCardComponent {
  @Input({ required: true }) epic!: Epic;

  getInitials(name: string): string {
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }
}
