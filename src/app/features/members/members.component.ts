import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from './members.service';
import { Member } from './members.model';
import { NgClass } from '@angular/common';
import { EditIconComponent } from '../../shared/icons/edit-icon.component';
import { ProjectErrorComponent } from '../project/components/project-error/project-error.component';
import { SkeltonComponent } from "./components/skelton/skelton.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [NgClass, EditIconComponent, ProjectErrorComponent, SkeltonComponent],
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
  isLoading = false;
  isError = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const projectId = params.get('id');

      if (projectId) {
        this.getMembers(projectId);
      }
    });
  }

  getMembers(projectId: string) {
    this.membersService.getProjectMembers(projectId)
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

  getInitials(name?: string): string {
    if (!name) return '';

    const words = name.trim().split(' ');

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
  }
}
