import { Routes } from '@angular/router';
import { SignupComponent } from './features/auth/signup/signup.component';
import { ProjectComponent } from './features/project/project.component';
import { LoginComponent } from './features/auth/login/login.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { authGuard } from './core/Guards/auth.guard';
import { TasksComponent } from './features/tasks/tasks.component';
import { MembersComponent } from './features/members/members.component';
import { EpicsComponent } from './features/epics/epics.component';
import { DetailsComponent } from './features/details/details.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { projectResolver } from './features/project/project.resolver';
import { ProjectFormComponent, projectFormTitleResolver } from './features/project/components/project-form/project-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent, title: 'Sign Up' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'forgot-password', component: ForgotPasswordComponent, title: 'Forgot Password' },
  { path: 'reset-password', component: ResetPasswordComponent, title: 'Reset Password' },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'project',
        children: [
          { path: '', component: ProjectComponent, title: 'Project' },
          { path: 'add', component: ProjectFormComponent, title: 'Add New Project' },
          {
            path: ':id',
            resolve: { project: projectResolver },
            children: [
              { path: 'edit', component: ProjectFormComponent, title: projectFormTitleResolver },
              { path: 'members', component: MembersComponent, title: 'Members' },
              { path: 'tasks', component: TasksComponent, title: 'Tasks' },
              { path: 'epics', component: EpicsComponent, title: 'Epics' },
            ],
          },
        ],
      },
    ],
  },
];
