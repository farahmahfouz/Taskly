import { Component } from '@angular/core';

@Component({
  selector: 'svg[icon-check-circle]',
  standalone: true,
  template: `
    <svg:path
      d="M8.6 14.6L15.65 7.55L14.25 6.15L8.6 11.8L5.75 8.95L4.35 10.35L8.6 14.6ZM10 20C4.477 20 0 15.523 0 10S4.477 0 10 0 20 4.477 20 10 15.523 20 10 20Z"
      fill="currentColor"
    />
  `,
  host: {
    '[attr.viewBox]': '"0 0 20 20"',
  },
})
export class CheckCircleIconComponent {}
