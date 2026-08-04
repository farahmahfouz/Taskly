import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { EditIconComponent } from '../../icons/edit-icon.component';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [EditIconComponent],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() totalCount = 0;
  @Input() pageSize = 10;

  @Output() pageChange = new EventEmitter<number>();

  get firstPages(): number[] {
    const pages: number[] = [];

    if (this.totalPages <= 1) {
      return [];
    }
    const maxStart = Math.max(1, this.totalPages - 2); // last number i should start with
    let start = this.currentPage === 1 ? 1 : this.currentPage - 1;
    start = Math.min(start, maxStart); // tp start from last number

    const end = Math.min(start + 1, this.totalPages - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  goToPage(page: number) {
    this.pageChange.emit(page);
  }

  get showingCount(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalCount);
  }
}
