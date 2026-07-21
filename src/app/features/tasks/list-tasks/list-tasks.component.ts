import { Component, Input } from '@angular/core';
import { DateIconComponent } from "../../../shared/icons";

@Component({
  selector: 'app-list-tasks',
  standalone: true,
  imports: [DateIconComponent],
  templateUrl: './list-tasks.component.html',
  styleUrl: './list-tasks.component.css'
})
export class ListTasksComponent {
  @Input() status = '';
}
