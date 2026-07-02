import { Component } from '@angular/core';

@Component({
  selector: 'svg[icon-clock]',
  standalone: true,
  template: `
    <svg:path
      d="M10 18C5.582 18 2 14.418 2 10S5.582 2 10 2 18 5.582 18 10"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
    <svg:path
      d="M10 6V10L13 12"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
  `,
  host: {
    '[attr.viewBox]': '"0 0 20 20"',
    '[attr.fill]': '"none"',
  },
})
export class ClockIconComponent {}