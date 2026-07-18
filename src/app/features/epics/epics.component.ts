import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { EpicCardComponent } from './components/epic-card/epic-card.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EpicsService } from './epics.service';
import { Epic } from './epic.model';
import { SearchIconComponent } from '../../shared/icons';
import { ProjectErrorComponent } from '../project/components/project-error/project-error.component';
import { EmptyEpicsComponent } from './components/empty-epics/empty-epics.component';
import { SkeltonComponent } from '../project/components/skelton/skelton.component';
import { SkeltonEpicsComponent } from './components/skelton-epics/skelton-epics.component';
import { HttpResponse } from '@angular/common/http';
import { InfinteScrollDirective } from '../../shared/directives/infinte-scroll.directive';
import { EpicPopupComponent } from './components/epic-popup/epic-popup.component';

@Component({
  selector: 'app-epics',
  standalone: true,
  imports: [
    PaginationComponent,
    EpicCardComponent,
    SearchIconComponent,
    ProjectErrorComponent,
    EmptyEpicsComponent,
    SkeltonEpicsComponent,
    RouterLink,
    InfinteScrollDirective,
    EpicPopupComponent,
  ],
  templateUrl: './epics.component.html',
  styleUrl: './epics.component.css',
})
export class EpicsComponent implements OnInit {
  projectId = '';
  epics: Epic[] = [];
  isError = false;
  isLoading = false;

  showEpicModal = false;
  selectedEpicId!: string;

  currentPage = 1;
  limit = 2;

  totalCount = 0;
  totalPages = 0;

  constructor(
    private route: ActivatedRoute,
    private epicsService: EpicsService,
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    
    this.epicsService.epics$.subscribe(epics => {
      this.epics = epics;
    });
    if (this.projectId) {
      this.getProjectEpics();
    }
  }

  get offset() {
    return (this.currentPage - 1) * this.limit;
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.getProjectEpics();
  }

  nextPage() {
    this.changePage(this.currentPage + 1);
  }

  previousPage() {
    this.changePage(this.currentPage - 1);
  }

  loadMore() {
    if (this.isLoading) return;
    if (this.currentPage >= this.totalPages) return;

    this.currentPage++;
    this.getProjectEpics(true);
  }

  getProjectEpics(mobileScreenLoader = false) {
    if (mobileScreenLoader) {
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }

    this.epicsService.getAllProjectEpics(this.projectId, this.limit, this.offset).subscribe({
      next: (res: HttpResponse<Epic[]>) => {
        const newEpics = res.body ?? [];

        this.epics = mobileScreenLoader ? [...this.epics, ...newEpics] : newEpics;
        this.epicsService.setEpics(this.epics);
        
        const contentRange = res.headers.get('Content-Range');

        this.totalCount = Number(contentRange?.split('/')[1] ?? 0);

        this.totalPages = Math.ceil(this.totalCount / this.limit);

        this.isLoading = false;
        this.isError = false;
      },
      error: err => {
        this.isLoading = false;
        this.isError = true;
      },
    });
  }

  openEpicModal(epicId: string) {
    this.selectedEpicId = epicId;
    this.showEpicModal = true;
  }
}
