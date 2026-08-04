import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlusCircleIconComponent } from "../../../../shared/icons/plus-circle-icon.component";

@Component({
  selector: 'app-empty-projects',
  standalone: true,
  imports: [RouterLink, PlusCircleIconComponent],
  templateUrl: './empty-projects.component.html',
  styleUrl: './empty-projects.component.css',
})
export class EmptyProjectsComponent {}
