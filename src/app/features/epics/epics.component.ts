import { Component, DestroyRef, OnInit } from '@angular/core';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { EpicCardComponent } from './components/epic-card/epic-card.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EpicsService } from './epics.service';
import { Epic } from './epic.model';
import { SearchIconComponent } from '../../shared/icons';
import { EmptyEpicsComponent } from './components/empty-epics/empty-epics.component';
import { SkeltonEpicsComponent } from './components/skelton-epics/skelton-epics.component';
import { HttpResponse } from '@angular/common/http';
import { InfinteScrollDirective } from '../../shared/directives/infinte-scroll.directive';
import { EpicPopupComponent } from './components/epic-popup/epic-popup.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ErrorPageComponent } from '../../shared/components/error-page/error-page.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { LoaderComponent } from "../../shared/components/loader/loader.component";

@Component({
  selector: 'app-epics',
  standalone: true,
  imports: [
    PaginationComponent,
    EpicCardComponent,
    SearchIconComponent,
    EmptyEpicsComponent,
    SkeltonEpicsComponent,
    RouterLink,
    InfinteScrollDirective,
    EpicPopupComponent,
    ErrorPageComponent,
    ReactiveFormsModule,
    LoaderComponent
],
  templateUrl: './epics.component.html',
  styleUrl: './epics.component.css',
})
export class EpicsComponent implements OnInit {
  projectId = '';
  epics: Epic[] = [];
  isError = false;
  isLoading = false;
  isFirstLoading = false;
  isSearchLoading = false;

  showEpicModal = false;
  selectedEpicId!: string;

  currentPage = 1;
  limit = 4;

  totalCount = 0;
  totalPages = 0;

  constructor(
    private route: ActivatedRoute,
    private epicsService: EpicsService,
    private destroyRef: DestroyRef,
  ) {}

  searchControl = new FormControl('');

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id')!;

    this.epicsService.epics$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(epics => {
      this.epics = epics;
    });
    if (this.projectId) {
      this.getProjectEpics(false, 'first');
    }

    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.currentPage = 1;
        this.getProjectEpics(false, 'search');
      });
  }

  get offset() {
    return (this.currentPage - 1) * this.limit;
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.getProjectEpics(false, 'pagination');
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
    this.getProjectEpics(true, 'pagination');
  }

  getProjectEpics(mobileScreenLoader = false, type: 'first' | 'search' | 'pagination' = 'first') {
    if (mobileScreenLoader) {
      // this.isLoading = false;
    } else if (type === 'first') {
      this.isFirstLoading = true;
    } else if (type === 'search'){
      this.isSearchLoading = true;
    }

    this.isError = false;

    this.epicsService
      .getAllProjectEpics(this.projectId, this.limit, this.offset, this.searchControl.value ?? '')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: HttpResponse<Epic[]>) => {
          const newEpics = res.body ?? [];

          this.epics = mobileScreenLoader ? [...this.epics, ...newEpics] : newEpics;
          this.epicsService.setEpics(this.epics);

          const contentRange = res.headers.get('Content-Range');

          this.totalCount = Number(contentRange?.split('/')[1] ?? 0);

          this.totalPages = Math.ceil(this.totalCount / this.limit);

          this.isFirstLoading = false;
          this.isSearchLoading = false;

          this.isError = false;
        },
        error: err => {
          this.isFirstLoading = false;
          this.isSearchLoading = false;

          this.isError = true;
        },
      });
  }

  openEpicModal(epicId: string) {
    this.selectedEpicId = epicId;
    this.showEpicModal = true;
  }
}
