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
    this.observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          this.scrolled.emit();
        }
      },
      {
        threshold: 0.3,
      },
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
