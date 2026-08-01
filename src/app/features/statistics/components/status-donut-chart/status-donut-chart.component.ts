import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DonutSegment, LegendItem } from '../../statistics.model';

@Component({
  selector: 'app-status-donut-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-donut-chart.component.html',
})
export class StatusDonutChartComponent {
  @Input() totalTasks = 0;
  @Input() donutCircumference = 345.6;
  @Input() donutSegments: DonutSegment[] = [];
  @Input() legend: LegendItem[] = [];
  
  getPercent(count: number): number {
    return this.totalTasks > 0 ? (count / this.totalTasks) * 100 : 0;
  }
}
