import { Component } from '@angular/core';

@Component({
  selector: 'svg[icon-close]',
  standalone: true,
  template: `
    <svg:path
      d="M9.4 22L8 20.6L13.6 15L8 9.4L9.4 8L15 13.6L20.6 8L22 9.4L16.4 15L22 20.6L20.6 22L15 16.4L9.4 22Z"
      fill="currentColor"
    />
  `,
  host: {
    '[attr.viewBox]': '"0 0 30 30"',
  },
})
export class CloseIconComponent {}
