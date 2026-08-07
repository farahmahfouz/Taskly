import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { MembersService } from '../members.service';
import { HttpContext } from '@angular/common/http';
import { SKIP_GLOBAL_ERROR_TOAST } from '../../../core/interceptors/error.interceptor';
import { IconComponent } from '../../../shared/icons/icon.component';

type InvitationState = 'idle' | 'invalid-link' | 'expired' | 'forbidden' | 'invalid-token';

@Component({
  selector: 'app-accept-invitation',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './accept-invitation.component.html',
  styleUrl: './accept-invitation.component.css',
})
export class AcceptInvitationComponent implements OnInit {
  token = '';
  isLoading = false;
  state: InvitationState = 'idle';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toast: ToastService,
    private membersService: MembersService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const token = params.get('token');
      if (!token) {
        this.state = 'invalid-link';
        return;
      }
      this.token = token;

      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/login'], {
          queryParams: {
            returnUrl: this.router.url,
          },
        });
        return;
      }
    });
  }

  acceptInvitation() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.state = 'idle';

    this.membersService
      .acceptInvite(
        { p_token: this.token },
        { context: new HttpContext().set(SKIP_GLOBAL_ERROR_TOAST, true) },
      )
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toast.showSuccess('Invitation accepted successfully');
          this.router.navigate(['/project']);
        },
        error: err => {
          this.isLoading = false;

          if (err.status === 0) {
            this.toast.showError('Network error. Please try again.');
            return;
          }

          if (err.status === 403) {
            this.state = 'forbidden';
            return;
          }

          if (err.status === 400) {
            this.state = err.error?.message === 'Invitation expired' ? 'expired' : 'invalid-token';
            return;
          }

          this.toast.showError('Something went wrong. Please try again.');
        },
      });
  }
}
