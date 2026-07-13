import { Component } from '@angular/core';

@Component({
  selector: 'svg[icon-arrow-back]',
  standalone: true,
  template: `
    <svg:path
      d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z"
      fill="currentColor"
    />
  `,
  host: {
    '[attr.viewBox]': '"0 0 16 16"',
  },
})
export class ArrowBackIconComponent {}
