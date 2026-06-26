import { Component } from '@angular/core';
import { FormLayoutComponent } from '../../shared/components/form-layout/form-layout.component';
import { ControlComponent } from "../../shared/components/control/control.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormLayoutComponent, ControlComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
