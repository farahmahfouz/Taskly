import { Component } from '@angular/core';

@Component({
  selector: 'svg[icon-menu]',
  standalone: true,
  template: `
    <svg:path d="M4 16V14H22V16H4ZM4 11V9H22V11H4ZM4 6V4H22V6H4Z" fill="currentColor" />
  `,
  host: {
    '[attr.viewBox]': '"0 0 26 20"',
  },
})
export class MenuIconComponent {}
