import { Component } from '@angular/core';
import { ProjectCardComponent } from './components/project-card/project-card.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [ProjectCardComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {
   projects = Array(5).fill({});
}
