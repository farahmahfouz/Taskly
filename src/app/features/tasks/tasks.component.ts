import { Component } from '@angular/core';
import { ListTasksComponent } from "./list-tasks/list-tasks.component";
import { SearchIconComponent } from "../../shared/icons";

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [ListTasksComponent, SearchIconComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {

  statuses = [
  'TO DO',
  'IN PROGRESS',
  'BLOCKED',
  'IN REVIEW',
  'READY FOR QA',
  'REOPENED',
  'READY FOR PRODUCTION',
  'DONE'
];
}
