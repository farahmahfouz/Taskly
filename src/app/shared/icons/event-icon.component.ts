import { Component } from '@angular/core';

@Component({
  selector: 'svg[icon-event]',
  standalone: true,
  template: `
    <svg:path
      d="M1 18C0.45 18 -0.020833 17.8042 -0.4125 17.4125C-0.804167 17.0208 -1 16.55 -1 16V4C-1 3.45 -0.804167 2.97917 -0.4125 2.5875C-0.020833 2.19583 0.45 2 1 2H2V0H4V2H12V0H14V2H15C15.55 2 16.0208 2.19583 16.4125 2.5875C16.8042 2.97917 17 3.45 17 4V16C17 16.55 16.8042 17.0208 16.4125 17.4125C16.0208 17.8042 15.55 18 15 18H1ZM1 16H15V7H1V16ZM1 5H15V4H1V5ZM1 5V4V5Z"
      fill="currentColor"
    />
  `,
  host: {
    '[attr.viewBox]': '"-1 0 18 18"',
  },
})
export class EventIconComponent {}