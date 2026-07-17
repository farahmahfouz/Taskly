import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Project } from '../../project.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EditIconComponent } from '../../../../shared/icons/edit-icon.component';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { TooltipDirective } from '../../../../shared/directives/tooltip.directive';
import { ProjectContextService } from '../../../../core/services/project-context.service';
import { DateIconComponent } from "../../../../shared/icons";

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [DatePipe, EditIconComponent, ClickOutsideDirective, TooltipDirective, DateIconComponent],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  constructor(
    private router: Router,
    private projectContextService: ProjectContextService,
  ) {}
  isMenuOpen = false;

  @Input() project!: Project;

  editProject() {
    this.projectContextService.setProjectId(this.project.id ?? '');
    this.router.navigate(['/project', this.project.id, 'edit']);
  }

  goToMembers() {
    this.projectContextService.setProjectId(this.project.id ?? '');
    this.router.navigate(['/project', this.project.id, 'members']);
  }

  goToEpics() {
    this.projectContextService.setProjectId(this.project.id ?? '');
    this.router.navigate(['/project', this.project.id, 'epics']);
  }
}
