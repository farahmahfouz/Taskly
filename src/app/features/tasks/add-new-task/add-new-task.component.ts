import { Component } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { Member } from '../../members/members.model';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersService } from '../../members/members.service';
import { ToastService } from '../../../core/services/toast.service';
import { TextareaComponent } from "../../../shared/components/textarea/textarea.component";

@Component({
  selector: 'app-add-new-task',
  standalone: true,
  imports: [InputComponent, TextareaComponent],
  templateUrl: './add-new-task.component.html',
  styleUrl: './add-new-task.component.css',
})
export class AddNewTaskComponent {
  members: Member[] = [];
  projectId = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private membersService: MembersService,
    private toaster: ToastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    this.membersService.getProjectMembers(this.projectId).subscribe({
      next: members => {
        this.members = members;
      },
      error: err => {
        console.log(err);
      },
    });
  }

  status = [
    { value: 'TO_DO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'BLOCKED', label: 'Blocked' },
    { value: 'IN_REVIEW', label: 'In Review' },
    { value: 'READY_FOR_QA', label: 'Ready for QA' },
    { value: 'REOPENED', label: 'Reopened' },
    { value: 'READY_FOR_PRODUCTION', label: 'Ready for Production' },
    { value: 'DONE', label: 'Done' },
  ];
}
