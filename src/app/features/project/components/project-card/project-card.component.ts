import { Component, Input } from '@angular/core';
import { Project } from '../../project.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  @Input() project!: Project;
}
