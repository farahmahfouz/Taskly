import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { EpicCardComponent } from './components/epic-card/epic-card.component';
import { ActivatedRoute } from '@angular/router';
import { EpicsService } from './epics.service';
import { Epic } from './epic.model';

@Component({
  selector: 'app-epics',
  standalone: true,
  imports: [PaginationComponent, EpicCardComponent],
  templateUrl: './epics.component.html',
  styleUrl: './epics.component.css',
})
export class EpicsComponent implements OnInit {
  projectId = '';
  epics: Epic[] = [];
  constructor(
    private route: ActivatedRoute,
    private epicsService: EpicsService,
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    if (this.projectId) {
      this.getProjectEpics(this.projectId);
    }
  }

  getProjectEpics(projectId: string) {
    this.epicsService.getAllProjectEpics(projectId).subscribe({
      next: res => {
        this.epics = res;
      },
      error: err => {
        console.log(err);
      },
    });
  }
}
