import { Component } from '@angular/core';
import { ArchitectureIconComponent, RocketIconComponent } from '../../../../shared/icons';
import {
  SparkleIconComponent,
  FlowIconComponent,
  TrendIconComponent,
} from '../../../../shared/icons/index';

@Component({
  selector: 'app-empty-epics',
  standalone: true,
  imports: [
    ArchitectureIconComponent,
    RocketIconComponent,
    SparkleIconComponent,
    FlowIconComponent,
    TrendIconComponent,
  ],
  templateUrl: './empty-epics.component.html',
  styleUrl: './empty-epics.component.css',
})
export class EmptyEpicsComponent {
  features = [
    {
      icon: 'sparkle',
      title: 'High-Level Goals',
      description: 'Define the broad objectives that span across multiple cycles.',
    },
    {
      icon: 'flow',
      title: 'Hierarchy Design',
      description: 'Link individual tasks to parent epics for a consolidated view.',
    },
    {
      icon: 'trend',
      title: 'Track Velocity',
      description: 'Visualize percentage completion at a macro project level.',
    },
  ];
}
