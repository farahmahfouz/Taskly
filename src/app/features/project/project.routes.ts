import { Routes } from '@angular/router';
import { ProjectComponent } from './project.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { projectBreadcrumb, projectResolver } from './project.resolver';
import { MembersComponent } from '../members/members.component';
import { TasksComponent } from '../tasks/tasks.component';
import { EpicsComponent } from '../epics/epics.component';
import { EpicFormComponent } from '../epics/components/epic-form/epic-form.component';
import { AddNewTaskComponent } from '../tasks/add-new-task/add-new-task.component';

export const projectRoutes: Routes = [
  { path: '', component: ProjectComponent, title: 'Projects' },
  {
    path: 'add',
    component: ProjectFormComponent,
    title: 'Add New Project',
    data: { breadcrumb: 'Add New Project' },
  },
  {
    path: ':id',
    resolve: { project: projectResolver },
    data: { breadcrumb: projectBreadcrumb },
    children: [
      { path: '', redirectTo: 'epics', pathMatch: 'full' },
      {
        path: 'edit',
        component: ProjectFormComponent,
        data: { breadcrumb: 'Edit Project' },
      },
      {
        path: 'members',
        component: MembersComponent,
        title: 'Members',
        data: { breadcrumb: 'Members' },
      },
      {
        path: 'epics',
        data: { breadcrumb: 'Epics' },
        children: [
          { path: '', component: EpicsComponent, title: 'Epics', data: { breadcrumb: null } },
          {
            path: 'new',
            component: EpicFormComponent,
            title: 'Create New Epic',
            data: { breadcrumb: 'New Epic' },
          },
        ],
      },
      {
        path: 'tasks',
        data: { breadcrumb: 'Tasks' },
        children: [
          { path: '', component: TasksComponent, title: 'Tasks', data: { breadcrumb: null } }, 
          {
            path: 'new',
            component: AddNewTaskComponent,
            title: 'New Task',
            data: { breadcrumb: 'New Task' },
          },
        ],
      },
    ],
  },
];
