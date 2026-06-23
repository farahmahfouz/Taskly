import { Component } from '@angular/core';
import { DashboardIconComponent } from './shared/icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardIconComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'taskly';
}
