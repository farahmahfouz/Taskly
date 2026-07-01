import { Component } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { FormLayoutComponent } from '../../../shared/components/form-layout/form-layout.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormLayoutComponent, InputComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

}
