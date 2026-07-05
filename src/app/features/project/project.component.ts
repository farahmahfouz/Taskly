import { Component } from '@angular/core';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { PaginationComponent } from "../../shared/components/pagination/pagination.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [ProjectCardComponent, PaginationComponent, RouterLink],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {
   projects = Array(5).fill({});
}
