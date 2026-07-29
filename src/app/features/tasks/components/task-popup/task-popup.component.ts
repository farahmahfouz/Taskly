import {
  Component,
  computed,
  EventEmitter,
  HostListener,
  Input,
  Output,
  signal,
} from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { CopyLinkIconComponent } from '../../../../shared/icons';
import { TASK_STATUS_BADGE_STYLES } from '../../task.constants';
import { DatePipe, NgClass } from '@angular/common';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { ArrowDownIconComponent } from '../../../../shared/icons/arrow-down-icon.component';
import { OpenPopupService } from '../../../../core/services/open-popup.service';

@Component({
  selector: 'app-task-popup',
  standalone: true,
  imports: [
    ModalComponent,
    CopyLinkIconComponent,
    DatePipe,
    InitialsPipe,
    ArrowDownIconComponent,
    NgClass,
  ],
  templateUrl: './task-popup.component.html',
  styleUrl: './task-popup.component.css',
})
export class TaskPopupComponent {
  @Input() isOpen = true;
  @Output() close = new EventEmitter<void>();

  isLoading = signal(false);
  hasError = signal(false);

  constructor(public openPopupService: OpenPopupService) {}
  readonly statusStyles = TASK_STATUS_BADGE_STYLES;

  statusBadgeClass = computed(() => {
    const status = this.openPopupService.task()?.status;
    return status ? this.statusStyles[status] : this.statusStyles['TO_DO'];
  });

  @HostListener('window:keydown.escape', ['$event'])
  handleEscapeKey(event: Event) {
    this.openPopupService.close();
  }
}
