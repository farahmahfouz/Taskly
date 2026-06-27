import { Routes } from '@angular/router';
import { SignupComponent } from './features/signup/signup.component';
import { ProjectComponent } from './features/project/project.component';
import { LoginComponent } from './features/login/login.component';
import { LayoutComponent } from './shared/components/layout/layout.component';

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
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'project',
        component: ProjectComponent,
        title: 'Project'
      }
    ]
  },
];
