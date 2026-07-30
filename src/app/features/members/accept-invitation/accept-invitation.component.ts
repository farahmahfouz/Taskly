import { Component, OnInit } from '@angular/core';
import { LogoIconComponent } from '../../../shared/icons/logo-icon.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { MembersService } from '../members.service';

@Component({
  selector: 'app-accept-invitation',
  standalone: true,
  imports: [LogoIconComponent],
  templateUrl: './accept-invitation.component.html',
  styleUrl: './accept-invitation.component.css',
})
export class AcceptInvitationComponent implements OnInit {
  token = '';
  isLoading = false;

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
        this.toast.showError('Invalid invitation link');
        this.router.navigate(['/']);
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
    this.isLoading = true;

    this.membersService
      .acceptInvite({
        p_token: this.token,
      })
      .subscribe({
        next: () => {
          this.isLoading = true;
          this.toast.showSuccess('Invitation accepted successfully');
          this.router.navigate(['/project']);
        },
        error: err => {
          this.isLoading = false;

          switch (err.status) {
            case 401:
              this.toast.showError('Unauthorized');
              break;

            case 400:
              this.toast.showError('Invalid or expired invitation');
              break;

            default:
              this.toast.showError('Something went wrong');
          }
        },
      });
  }
}
