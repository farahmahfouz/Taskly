import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
  OnInit,
} from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { DateIconComponent } from '../../../../shared/icons';
import { EpicsService } from '../../epics.service';
import { Epic } from '../../epic.model';
import { DatePipe } from '@angular/common';
import { getInitials } from '../../../../core/utils/getInitials';
import { MembersService } from '../../../members/members.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Member } from '../../../members/members.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { futureValidator } from '../../../../core/utils/futureValidator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-epic-popup',
  standalone: true,
  imports: [ModalComponent, DateIconComponent, DatePipe, ReactiveFormsModule],
  templateUrl: './epic-popup.component.html',
  styleUrl: './epic-popup.component.css',
})
export class EpicPopupComponent implements OnChanges, OnInit {
  @Input() isOpen = false;
  @Input() projectId!: string;
  @Input() epicId!: string;

  @Output() close = new EventEmitter<void>();

  epic?: Epic;
  getInitials = getInitials;
  members: Member[] = [];
  isEditingAssignee = false;

  constructor(
    private fb: FormBuilder,
    private epicsService: EpicsService,
    private membersService: MembersService,
    private toaster: ToastService,
    private router: Router,
  ) {}

  epicForm = this.fb.group({
    title: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'blur',
      },
    ],
    description: [
      '',
      {
        updateOn: 'blur',
      },
    ],
    assignee: [''],
    deadline: ['', futureValidator],
  });

  ngOnInit(): void {
    this.membersService.getProjectMembers(this.projectId).subscribe({
      next: members => {
        this.members = members;
      },
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['epicId'] && this.epicId) {
      this.epicsService.getProjectEpiById(this.projectId, this.epicId).subscribe(res => {
        this.epic = res[0];
        this.epicForm.patchValue({
          title: this.epic.title,
          description: this.epic.description,
          assignee: this.epic.assignee?.sub ?? '',
          deadline: this.epic.deadline,
        });
      });
    }
  }

  updateAssignee() {
    const previousValue = this.epicForm.get('assignee')?.value ?? '';
    const member = this.members.find(m => m.user_id === previousValue);
    const createdBy = this.epic?.created_by;

    this.epicsService
      .updateEpic(this.epic!.id, {
        assignee_id: this.epicForm.value.assignee || null,
      })
      .subscribe({
        next: updated => {
          this.epic = {
            ...this.epic,
            ...updated[0],
            created_by: createdBy ?? {
              sub: '',
              name: '',
              email: '',
              department: '',
            },
            assignee: member
              ? {
                  sub: member.user_id,
                  name: member.metadata.name,
                  email: member.metadata.email,
                  department: member.metadata.department,
                }
              : null,
          };
          this.epicsService.updateEpicInStore(this.epic);
        },
        error: () => {
          this.epicForm.patchValue({ assignee: previousValue });
          this.toaster.showError('Failed to update epic. Please try again.');
        },
      });
  }

  updateField(field: 'title' | 'description' | 'deadline') {
    const previousValue = this.epicForm.get(field)?.value ?? '';
    const createdBy = this.epic?.created_by;

    this.epicsService
      .updateEpic(this.epic!.id, {
        [field]: this.epicForm.value[field] || null,
      })
      .subscribe({
        next: updated => {
          this.epic = {
            ...this.epic,
            ...updated[0],
            created_by: createdBy ?? {
              sub: '',
              name: '',
              email: '',
              department: '',
            },
          };
        },
        error: () => {
          this.epicForm.patchValue({ [field]: previousValue });
          this.toaster.showError('Failed to update epic. Please try again.');
        },
      });
  }

  goToTasks() {
    this.router.navigate(['/project', this.projectId, 'tasks', 'new'], {
      queryParams: {
        epicId: this.epic?.id,
      },
    });
  }
  
}
