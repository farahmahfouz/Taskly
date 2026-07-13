import { Directive, Input, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
  host: {
    '(mouseenter)': 'hoverHandler($event)',
    '(mouseleave)': 'outHandler($event)',
  },
})
export class TooltipDirective implements OnDestroy {
  toolTipElement: HTMLElement | null = null;

  constructor(private renderer: Renderer2) {}

  @Input() appTooltip!: string;

  outHandler(event: any) {
    if (event?.target) {
      event.target.style.color = 'black';
    }
    this.removeTooltip();
  }

  hoverHandler(event: MouseEvent) {
    const target = event.target as HTMLElement;

    this.removeTooltip();

    this.toolTipElement = this.renderer.createElement('span');
    this.renderer.setProperty(this.toolTipElement, 'textContent', this.appTooltip);

    this.renderer.setStyle(this.toolTipElement, 'position', 'absolute');
    this.renderer.setStyle(this.toolTipElement, 'background', '#333');
    this.renderer.setStyle(this.toolTipElement, 'color', '#fff');
    this.renderer.setStyle(this.toolTipElement, 'padding', '4px 8px');
    this.renderer.setStyle(this.toolTipElement, 'borderRadius', '4px');
    this.renderer.setStyle(this.toolTipElement, 'fontSize', '12px');
    this.renderer.setStyle(this.toolTipElement, 'zIndex', '1000');

    const rect = target.getBoundingClientRect();
    this.renderer.setStyle(this.toolTipElement, 'left', `${rect.left + window.scrollX}px`);
    this.renderer.setStyle(this.toolTipElement, 'top', `${rect.bottom + window.scrollY + 8}px`);

    this.renderer.appendChild(document.body, this.toolTipElement);
  }

  private removeTooltip() {
    if (this.toolTipElement) {
      this.renderer.removeChild(document.body, this.toolTipElement);
      this.toolTipElement = null;
    }
  }

  ngOnDestroy(): void {
    this.removeTooltip();
  }
}
