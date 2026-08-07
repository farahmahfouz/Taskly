import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/icons/icon.component';

@Component({
  selector: 'app-empty-projects',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './empty-projects.component.html',
  styleUrl: './empty-projects.component.css',
})
export class EmptyProjectsComponent {}
