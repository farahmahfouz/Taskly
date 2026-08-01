import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SummaryCard } from '../../statistics.model';
import { WarningIconComponent } from "../../../../shared/icons";

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [CommonModule, WarningIconComponent],
  templateUrl: './summary-cards.component.html',
})
export class SummaryCardsComponent {
  @Input() cards: SummaryCard[] = [];
}
