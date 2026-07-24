import { Component } from '@angular/core';

@Component({
  selector: 'svg[icon-arrow-down]',
  standalone: true,
  template: `
    <svg:path
      d="M7.2002 9.59961L12.0002 14.3996L16.8002 9.59961"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  `,
  host: {
    '[attr.viewBox]': '"0 0 24 24"',
    '[attr.fill]': '"none"',
  },
})
export class ArrowDownIconComponent {}