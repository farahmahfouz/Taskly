import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appInfinteScroll]',
  standalone: true,
})
export class InfinteScrollDirective implements AfterViewInit, OnDestroy {
  @Output() scrolled = new EventEmitter();

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef) {}
  ngAfterViewInit() {
    const root = this.el.nativeElement.closest('.custom-scrollbar');
    this.observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          this.scrolled.emit();
        }
      },
      {
        root,
        threshold: 0.1,
      },
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
