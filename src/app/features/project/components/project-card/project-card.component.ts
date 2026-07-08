import { Component, Input } from '@angular/core';
import { Project } from '../../project.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EditIconComponent } from '../../../../shared/icons/edit-icon.component';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { DropdownMenuComponent } from "../../../../shared/components/dropdown-menu/dropdown-menu.component";

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [DatePipe, EditIconComponent, ClickOutsideDirective, DropdownMenuComponent],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css',
})
export class ProjectCardComponent {
  constructor(private router: Router) {}
  isMenuOpen = false;

  @Input() project!: Project;

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  projectItems = [
    {
      label: 'Details',
      action: () => this.goToMembers(),
    },
    {
      label: 'Edit Project',
      action: () => this.editProject(),
    },
  ];

  editProject() {
    this.router.navigate(['/project', this.project.id, 'edit']);
  }

  goToMembers() {
    this.router.navigate(['/project', this.project.id, 'members']);
  }

  goToEpics() {
    this.router.navigate(['/project', this.project.id, 'epics']);
  }
}
