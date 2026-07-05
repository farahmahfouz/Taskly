import { Component } from '@angular/core';

@Component({
  selector: 'app-skelton',
  standalone: true,
  imports: [],
  templateUrl: './skelton.component.html',
  styleUrl: './skelton.component.css'
})
export class SkeltonComponent {
 rows = [1, 2, 3, 4, 5];
}
