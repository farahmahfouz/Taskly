import { Component } from '@angular/core';
import { InputComponent } from "../../shared/components/input/input.component";
import { TextareaComponent } from '../../shared/components/textarea/textarea.component';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [InputComponent, TextareaComponent],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent {

}
