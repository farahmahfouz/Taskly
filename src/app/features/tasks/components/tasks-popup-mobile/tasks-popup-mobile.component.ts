import { Component, computed, inject } from '@angular/core';
import {
  CloseIconComponent,
  DateIconComponent,
  ClockIconComponent,
} from '../../../../shared/icons';
import { OpenPopupService } from '../../../../core/services/open-popup.service';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { DatePipe, NgClass } from '@angular/common';
import { TASK_STATUS_BADGE_STYLES } from '../../task.constants';
import { ModalMobileComponent } from '../../../../shared/components/modal-mobile/modal-mobile.component';

@Component({
  selector: 'app-tasks-popup-mobile',
  standalone: true,
  imports: [
    CloseIconComponent,
    DateIconComponent,
    ClockIconComponent,
    InitialsPipe,
    DatePipe,
    NgClass,
    ModalMobileComponent,
  ],
  templateUrl: './tasks-popup-mobile.component.html',
  styleUrl: './tasks-popup-mobile.component.css',
})
export class TasksPopupMobileComponent {
  public popupService = inject(OpenPopupService);

  readonly statusStyles = TASK_STATUS_BADGE_STYLES;

  statusBadgeClass = computed(() => {
    const status = this.popupService.task()?.status;
    return status ? this.statusStyles[status] : this.statusStyles['TO_DO'];
  });
}
