import { Component } from '@angular/core';
import { LogoIconComponent } from "../../icons/logo-icon.component";

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [LogoIconComponent],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.css'
})
export class LogoComponent {

}
