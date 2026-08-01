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
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { PaginationBase } from '../../shared/classes/pagination.base';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";

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
    LoaderComponent,
    BreadcrumbComponent
],
  templateUrl: './epics.component.html',
  styleUrl: './epics.component.css',
})
export class EpicsComponent extends PaginationBase implements OnInit {
  projectId = '';
  epics: Epic[] = [];
  isSearchError = false;
  isSearchLoading = false;

  showEpicModal = false;
  selectedEpicId!: string;

  constructor(
    private route: ActivatedRoute,
    private epicsService: EpicsService,
    private destroyRef: DestroyRef,
  ) {
    super();
  }

  searchControl = new FormControl('');

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id')!;

    this.epicsService.epics$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(epics => {
      this.epics = epics;
    });
    if (this.projectId) {
      this.isFirstLoading = true;
      this.loadPage(false);
    }

    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.currentPage = 1;
        this.loadPage(false);
      });
  }

  protected loadPage(loadMore: boolean) {
    if (loadMore) {
      this.isLoadingMore = true;
    } else if (!this.isFirstLoading) {
      this.isLoading = true;
    }

    this.isError = false;

    this.epicsService
      .getAllProjectEpics(this.projectId, this.limit, this.offset, this.searchControl.value ?? '')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: HttpResponse<Epic[]>) => {
          const newEpics = res.body ?? [];

          this.epics = loadMore ? [...this.epics, ...newEpics] : newEpics;
          this.epicsService.setEpics(this.epics);

          const contentRange = res.headers.get('Content-Range');

          this.totalCount = Number(contentRange?.split('/')[1] ?? 0);

          this.totalPages = Math.ceil(this.totalCount / this.limit);

          this.isFirstLoading = false;
          this.isLoading = false;
          this.isLoadingMore = false;

          this.isError = false;
        },
        error: err => {
          this.isFirstLoading = false;
          this.isLoading = false;
          this.isLoadingMore = false;
          this.isError = true;
        },
      });
  }

  openEpicModal(epicId: string) {
    this.selectedEpicId = epicId;
    this.showEpicModal = true;
  }
}
