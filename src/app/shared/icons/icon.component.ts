import { Component, input, computed } from '@angular/core';
import { ICONS } from './icons';

@Component({
  selector: 'svg[icon]',
  standalone: true,
  template: `
    @for (d of def().paths; track d) {
      <svg:path
        [attr.d]="d"
        [attr.fill]="def().stroke ? 'none' : (def().fill ?? 'currentColor')"
        [attr.stroke]="def().stroke"
        [attr.stroke-width]="def().strokeWidth"
        [attr.stroke-linecap]="def().strokeLinecap"
        [attr.stroke-linejoin]="def().strokeLinejoin"
      />
    }
  `,
  host: {
    '[attr.viewBox]': 'def().viewBox',
  },
})
export class IconComponent {
  icon = input.required<string>();
  def = computed(() => ICONS[this.icon()] ?? { viewBox: '0 0 24 24', paths: [] });
}
