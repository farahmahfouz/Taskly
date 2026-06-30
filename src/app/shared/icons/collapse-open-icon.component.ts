import { Component } from '@angular/core';

@Component({
  selector: 'svg[icon-collapse-open]',
  standalone: true,
  template: `
    <svg:path
      d="M1.78301 6.16699e-06L11.7787 10.0043L1.77442 20L0.000178955 18.2242L8.22871 10.0028L0.00725113 1.77424L1.78301 6.16699e-06Z"
      fill="currentColor"
    />
  `,
  host: {
    '[attr.viewBox]': '"0 0 12 20"',
  },
})
export class CollapseOpenIconComponent {}