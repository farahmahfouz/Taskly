import { Component, Input } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-form-layout',
  standalone: true,
  imports: [LogoComponent, NgClass],
  templateUrl: './form-layout.component.html',
  styleUrl: './form-layout.component.css',
})
export class FormLayoutComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input() mobileDescription = '';

  @Input() containerClass = 'bg-background md:bg-white';

  @Input() contentClass = 'p-6 md:p-12';

  @Input() titleClass = 'text-start md:text-center';

  @Input() descriptionClass = 'md:text-center text-start';

  @Input() mobileDescriptionClass = 'text-start';

  @Input() hightClass = 'min-h-[90vh] md:min-h-auto pb-12';

  @Input() headerOutside = false;
}
