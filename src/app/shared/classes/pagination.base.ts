export abstract class PaginationBase {
  currentPage = 1;
  limit = 10;

  totalCount = 0;
  totalPages = 0;

  isLoading = false;
  isLoadingMore = false;
  isError = false;

  get offset() {
    return (this.currentPage - 1) * this.limit;
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.loadPage(false);
  }

  nextPage() {
    this.changePage(this.currentPage + 1);
  }

  previousPage() {
    this.changePage(this.currentPage - 1);
  }

  loadMore() {
    if (this.isLoading || this.isLoadingMore) return;
    if (this.currentPage >= this.totalPages) return;

    this.currentPage++;
    this.loadPage(true);
  }

  protected abstract loadPage(loadMore: boolean): void;
}
