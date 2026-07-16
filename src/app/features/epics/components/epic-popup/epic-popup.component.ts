import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { DateIconComponent } from '../../../../shared/icons';
import { EpicsService } from '../../epics.service';
import { Epic } from '../../epic.model';
import { DatePipe } from '@angular/common';
import { getInitials } from '../../../../core/utils/getInitials';

@Component({
  selector: 'app-epic-popup',
  standalone: true,
  imports: [ModalComponent, DateIconComponent, DatePipe],
  templateUrl: './epic-popup.component.html',
  styleUrl: './epic-popup.component.css',
})
export class EpicPopupComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() projectId!: string;
  @Input() epicId!: string;

  @Output() close = new EventEmitter<void>();

  epic?: Epic;
  getInitials = getInitials;

  constructor(private epicsService: EpicsService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['epicId'] && this.epicId) {
      this.epicsService.getProjectEpiById(this.projectId, this.epicId).subscribe(res => {
        this.epic = res[0];
      });
    }
  }
}
