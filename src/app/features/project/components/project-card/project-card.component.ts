import { Component, Input } from '@angular/core';
import { Project } from '../../project.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EditIconComponent } from '../../../../shared/icons/edit-icon.component';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [DatePipe, EditIconComponent, ClickOutsideDirective],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css',
})
export class ProjectCardComponent {
  constructor(private router: Router) {}
  isMenuOpen = false;

  @Input() project!: Project;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  editProject() {
    this.router.navigate(['/project', this.project.id, 'edit']);
  }

  goToMembers() {
    this.router.navigate(['/project', this.project.id, 'members']);
  }
}
