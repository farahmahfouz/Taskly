import { Component } from '@angular/core';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { EpicCardComponent } from "./components/epic-card/epic-card.component";

@Component({
  selector: 'app-epics',
  standalone: true,
  imports: [PaginationComponent, EpicCardComponent],
  templateUrl: './epics.component.html',
  styleUrl: './epics.component.css',
})
export class EpicsComponent {}
