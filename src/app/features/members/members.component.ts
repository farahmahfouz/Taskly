import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from './members.service';
import { Member } from './members.model';
import { NgClass } from '@angular/common';
import { SkeltonComponent } from './components/skelton/skelton.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ErrorPageComponent } from '../../shared/components/error-page/error-page.component';
import { InitialsPipe } from '../../shared/pipes/initials.pipe';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { InviteMembersComponent } from './components/invite-members/invite-members.component';
import { IconComponent } from '../../shared/icons/icon.component';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [
    NgClass,
    SkeltonComponent,
    ErrorPageComponent,
    InitialsPipe,
    BreadcrumbComponent,
    InviteMembersComponent,
    IconComponent,
  ],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css',
})
export class MembersComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private membersService: MembersService,
    private destroyRef: DestroyRef,
  ) {}

  members: Member[] = [];
  projectId = '';
  projectName = '';
  isLoading = false;
  isError = false;
  isOpen = false;

  ngOnInit() {
    const project = this.route.snapshot.data['project'];
    this.projectName = project?.name ?? '';

    this.route.paramMap.subscribe(params => {
      const projectId = params.get('id');

      if (projectId) {
        this.projectId = projectId;
        this.getMembers(projectId);
      }
    });
  }

  onMemberInvited() {
    if (this.projectId) {
      this.getMembers(this.projectId);
    }
  }

  getMembers(projectId: string) {
    this.membersService
      .getProjectMembers(projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.members = res;
          this.isError = false;
        },
        error: () => {
          this.isLoading = false;
          this.isError = true;
        },
      });
  }
}
