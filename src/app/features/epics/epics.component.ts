import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { EpicCardComponent } from './components/epic-card/epic-card.component';
import { ActivatedRoute } from '@angular/router';
import { EpicsService } from './epics.service';
import { Epic } from './epic.model';
import { SearchIconComponent } from "../../shared/icons";
import { ProjectErrorComponent } from "../project/components/project-error/project-error.component";
import { EmptyEpicsComponent } from "./components/empty-epics/empty-epics.component";

@Component({
  selector: 'app-epics',
  standalone: true,
  imports: [PaginationComponent, EpicCardComponent, SearchIconComponent, ProjectErrorComponent, EmptyEpicsComponent],
  templateUrl: './epics.component.html',
  styleUrl: './epics.component.css',
})
export class EpicsComponent implements OnInit {
  projectId = '';
  epics: Epic[] = [];
  isError = false;
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
        this.isError = false;
      },
      error: err => {
        console.log(err);
        this.isError = true;
      },
    });
  }
}
