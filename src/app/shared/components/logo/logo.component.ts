import { Component } from '@angular/core';
import { IconComponent } from '../../icons/icon.component';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.css',
})
export class LogoComponent {}
