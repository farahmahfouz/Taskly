import { Component } from '@angular/core';

@Component({
  selector: 'svg[icon-collapse]',
  standalone: true,
  template: `
    <svg:path d="M10 20L0 10L10 0L11.775 1.775L3.55 10L11.775 18.225L10 20Z" fill="currentColor" />
  `,
  host: {
    '[attr.viewBox]': '"0 0 12 20"',
  },
})
export class CollapseIconComponent {}
