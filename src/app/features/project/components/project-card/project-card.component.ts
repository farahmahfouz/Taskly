import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Project } from '../../project.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EditIconComponent } from '../../../../shared/icons/edit-icon.component';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { TooltipDirective } from '../../../../shared/directives/tooltip.directive';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [DatePipe, EditIconComponent, ClickOutsideDirective, TooltipDirective],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  constructor(private router: Router) {}
  isMenuOpen = false;

  @Input() project!: Project;

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
