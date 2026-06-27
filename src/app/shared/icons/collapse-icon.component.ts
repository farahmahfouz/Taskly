import { Component } from '@angular/core';

@Component({
  selector: 'app-collapse-icon',
  standalone: true,
  template: `
    <svg
      width="12"
      height="20"
      viewBox="0 0 12 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 20L0 10L10 0L11.775 1.775L3.55 10L11.775 18.225L10 20Z"
        fill="currentColor"
      />
    </svg>
  `,
})
export class CollapseIconComponent {}