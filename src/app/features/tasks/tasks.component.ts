import { Component } from '@angular/core';
import { SearchIconComponent } from '../../shared/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksListViewComponent } from "./tasks-list-view/tasks-list-view.component";
import { TasksBoardViewComponent } from "./tasks-board-view/tasks-board-view.component";

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [SearchIconComponent, TasksListViewComponent, TasksBoardViewComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  currentView = 'board';
  statuses = [
    {
      value: 'TO_DO',
      label: 'TO DO',
      dotColor: 'bg-neutral-light',
      badgeClass: 'bg-surface-highest text-neutral-dark',
      cardClass: 'bg-white border border-[#C3C6D61A]',
      dateClass: 'text-[#94A3B8]',
      icon: 'date',
    },
    {
      value: 'IN_PROGRESS',
      label: 'IN PROGRESS',
      dotColor: 'bg-primary',
      badgeClass: 'bg-surface-highest text-neutral-dark',
      cardClass: 'bg-white border-l-3 border-primary',
      dateClass: 'text-primary',
      icon: 'date',
    },
    {
      value: 'BLOCKED',
      label: 'BLOCKED',
      dotColor: 'bg-error',
      badgeClass: 'bg-[#FFDAD6] text-error',
      cardClass: 'bg-[#FFDAD633] border border-[#BA1A1A1A]',
      dateClass: 'text-error',
      icon: 'warning',
    },
    {
      value: 'IN_REVIEW',
      label: 'IN REVIEW',
      dotColor: 'bg-green-500',
      badgeClass: 'bg-surface-highest text-neutral-dark',
      cardClass: 'bg-white border border-[#C3C6D61A]',
      dateClass: 'text-[#94A3B8]',
      icon: 'date',
    },
    {
      value: 'READY_FOR_QA',
      label: 'READY FOR QA',
      dotColor: 'bg-yellow-500',
      badgeClass: 'bg-surface-highest text-neutral-dark',
      cardClass: 'bg-white border border-[#C3C6D61A]',
      dateClass: 'text-[#94A3B8]',
      icon: 'date',
    },
    {
      value: 'REOPENED',
      label: 'REOPENED',
      dotColor: 'bg-orange-500',
      badgeClass: 'bg-surface-highest text-neutral-dark',
      cardClass: 'bg-white border border-[#C3C6D61A]',
      dateClass: 'text-[#94A3B8]',
      icon: 'date',
    },
    {
      value: 'READY_FOR_PRODUCTION',
      label: 'READY FOR PRODUCTION',
      dotColor: 'bg-cyan-500',
      badgeClass: 'bg-surface-highest text-neutral-dark',
      cardClass: 'bg-white border border-[#C3C6D61A]',
      dateClass: 'text-[#94A3B8]',
      icon: 'date',
    },
    {
      value: 'DONE',
      label: 'DONE',
      dotColor: 'bg-green-600',
      badgeClass: 'bg-green-100 text-green-700',
      cardClass: 'bg-white border border-[#C3C6D61A]',
      dateClass: 'text-green-600',
      icon: 'date',
    },
  ];

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const view = params.get('view');

      if (!view) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { view: 'board' },
          queryParamsHandling: 'merge',
        });
        return;
      }

      this.currentView = view;
    });
  }

  changeView(event: Event) {
    const view = (event.target as HTMLSelectElement).value;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view },
      queryParamsHandling: 'merge',
    });
  }
}
