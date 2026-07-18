import { Routes } from '@angular/router';
import { ProjectComponent } from './project.component';
import {
  ProjectFormComponent,
  projectFormTitleResolver,
} from './components/project-form/project-form.component';
import { projectResolver } from './project.resolver';
import { MembersComponent } from '../members/members.component';
import { TasksComponent } from '../tasks/tasks.component';
import { EpicsComponent } from '../epics/epics.component';
import { EpicFormComponent } from '../epics/components/epic-form/epic-form.component';
import { AddNewTaskComponent } from '../tasks/add-new-task/add-new-task.component';

export const projectRoutes: Routes = [
  { path: '', component: ProjectComponent, title: 'Project' },
  { path: 'add', component: ProjectFormComponent, title: 'Add New Project' },
  {
    path: ':id',
    resolve: { project: projectResolver },
    children: [
      { path: 'edit', component: ProjectFormComponent, title: projectFormTitleResolver },
      { path: 'members', component: MembersComponent, title: 'Members' },
      {
        path: 'tasks',
        children: [
          {
            path: '',
            component: TasksComponent,
            title: 'Tasks',
          },
          {
            path: 'new',
            component: AddNewTaskComponent,
            title: 'New Task',
          },
        ],
      },
      {
        path: 'epics',
        children: [
          {
            path: '',
            component: EpicsComponent,
            title: 'Epics',
          },
          {
            path: 'new',
            component: EpicFormComponent,
            title: 'Create New Epic',
          },
        ],
      },
    ],
  },
];
