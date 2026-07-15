import { Component, HostListener } from '@angular/core';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea.component';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-epic-form',
  standalone: true,
  imports: [TextareaComponent, InputComponent],
  templateUrl: './epic-form.component.html',
  styleUrl: './epic-form.component.css',
})
export class EpicFormComponent {
  isDesktop = window.innerWidth >= 768;

  @HostListener('window:resize')
  onResize() {
    this.isDesktop = window.innerWidth >= 768;
  }
}
