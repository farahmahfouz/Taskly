import { Routes } from '@angular/router';
import { SignupComponent } from './features/signup/signup.component';
import { ProjectComponent } from './features/project/project.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'signup',
    pathMatch: 'full',
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Sign Up',
  },
  {
    path: 'project',
    component: ProjectComponent,
    title: 'Project',
  },
];
