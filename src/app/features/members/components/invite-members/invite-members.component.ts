import { Component, DestroyRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { CloseIconComponent } from '../../../../shared/icons';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ModalMobileComponent } from '../../../../shared/components/modal-mobile/modal-mobile.component';
import { MembersService } from '../../members.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ENVIRONMENT } from '../../../../core/utils/enviroment';
import { getControlError } from '../../../../core/utils/form-error.util';
import { inject } from '@angular/core';

@Component({
  selector: 'app-invite-members',
  standalone: true,
  imports: [ModalComponent, CloseIconComponent, InputComponent, ModalMobileComponent, ReactiveFormsModule],
  templateUrl: './invite-members.component.html',
  styleUrl: './invite-members.component.css',
})
export class InviteMembersComponent {
  private membersService = inject(MembersService);
  private toast = inject(ToastService);
  private env = inject(ENVIRONMENT);
  private destroyRef = inject(DestroyRef);

  @Input() isOpen = false;
  @Input() projectId = '';
  @Input() projectName = '';
  @Output() close = new EventEmitter<void>();
  @Output() invited = new EventEmitter<void>();

  isMobile = window.innerWidth < 768;
  isLoading = false;

  form = new FormGroup({
    email: new FormControl('farahmahfouz11@gmail.com', [Validators.required, Validators.email]),
  });

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  getError(): string {
    return getControlError(this.form.get('email'));
  }

  onClose() {
    this.form.reset();
    this.close.emit();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    console.log(window.location.origin)
    console.log(this.env.apiUrl)
    console.log(this.projectId) 
    console.log(this.form.value.email!)

    this.membersService
      .inviteMember({
        p_email: this.form.value.email!,
        p_project_id: this.projectId,
        p_app_url: window.location.origin,
        p_base_url: this.env.apiUrl,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toast.showSuccess('Invitation sent successfully');
          this.form.reset();
          this.invited.emit();
          this.close.emit();
        },
        error: err => {
          this.isLoading = false;

          if (err.status === 401) {
            this.toast.showError('You are not authorized to invite members.');
          } else {
            this.toast.showError('Something went wrong. Please try again.');
          }
        },
      });
  }
}
