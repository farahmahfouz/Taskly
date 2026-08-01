import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProjectRow } from '../../statistics.model';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-list.component.html',
})
export class ProjectsListComponent {
  @Input() projects: ProjectRow[] = [];
}
