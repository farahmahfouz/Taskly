import { Component, Input } from '@angular/core';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-form-layout',
  standalone: true,
  imports: [LogoComponent],
  templateUrl: './form-layout.component.html',
  styleUrl: './form-layout.component.css',
})
export class FormLayoutComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input() mobileDescription = '';
}
