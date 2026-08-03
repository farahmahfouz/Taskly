import { Routes } from '@angular/router';
import { SignupComponent } from './features/auth/signup/signup.component';
import { LoginComponent } from './features/auth/login/login.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { authGuard } from './core/Guards/auth.guard';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { guestGuard } from './core/Guards/guest.guard';
import { AcceptInvitationComponent } from './features/members/accept-invitation/accept-invitation.component';

export const routes: Routes = [
  {
    path: '',
    component: SignupComponent,
    canActivate: [guestGuard],
    title: 'Sign Up',
    data: { description: 'Create your TASKLY account and start managing your projects and tasks' }
  },
  { path: 'signup', redirectTo: '', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
    title: 'Login',
    data: { description: 'Log in to your TASKLY account to manage your projects and tasks' }
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    title: 'Forgot Password',
    data: { description: 'Reset your TASKLY account password' }
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    title: 'Reset Password',
    data: { description: 'Set a new password for your TASKLY account' }
  },
  {
    path: 'invite',
    component: AcceptInvitationComponent,
    title: 'Accept Invitation',
    data: { description: 'Accept your invitation to join a team on TASKLY' }
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'project',
        loadChildren: () => import('./features/project/project.routes').then(m => m.projectRoutes),
        data: {
          breadcrumb: 'Projects',
        },
      },
      {
        path: 'my-statistics',
        loadComponent: () => import('./features/statistics/statistics.component').then(c => c.StatisticsComponent),
        title: 'Stats',
        data: { description: 'View statistics and insights across all your projects' }
      },
    ],
  },
];