import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogoComponent } from "./shared/components/logo/logo.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LogoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'taskly';
}
