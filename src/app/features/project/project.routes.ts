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
  {
    path: '',
    component: ProjectComponent,
    title: 'Projects',
    data: { description: 'Browse all your projects and track their progress in one place on HERA' }
  },
  {
    path: 'add',
    component: ProjectFormComponent,
    title: 'Add New Project',
    data: {
      breadcrumb: 'Add New Project',
      description: 'Create a new project and start organizing tasks with your team'
    },
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
        data: {
          breadcrumb: 'Edit Project',
          description: 'Edit project details and update its information'
        },
      },
      {
        path: 'members',
        component: MembersComponent,
        title: 'Members',
        data: {
          breadcrumb: 'Members',
          description: 'Manage project team members and their permissions'
        },
      },
      {
        path: 'epics',
        data: { breadcrumb: 'Epics' },
        children: [
          {
            path: '',
            component: EpicsComponent,
            title: 'Epics',
            data: {
              breadcrumb: null,
              description: 'View all epics belonging to this project'
            }
          },
          {
            path: 'new',
            component: EpicFormComponent,
            title: 'Create New Epic',
            data: {
              breadcrumb: 'New Epic',
              description: 'Create a new epic to organize project tasks'
            },
          },
        ],
      },
      {
        path: 'tasks',
        data: { breadcrumb: 'Tasks' },
        children: [
          {
            path: '',
            component: TasksComponent,
            title: 'Tasks',
            data: {
              breadcrumb: null,
              description: 'Track all tasks for this project in one place'
            }
          },
          {
            path: 'new',
            component: AddNewTaskComponent,
            title: 'New Task',
            data: {
              breadcrumb: 'New Task',
              description: 'Add a new task to the project'
            },
          },
        ],
      },
    ],
  },
];
