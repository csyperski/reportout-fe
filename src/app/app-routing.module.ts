import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'login', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)},
  {path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)},
  {path: 'users', loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule)},
  {path: 'datasources', loadChildren: () => import('./modules/datasource/datasource.module').then(m => m.DataSourceModule)},
  {path: 'jobs', loadChildren: () => import('./modules/job/job.module').then(m => m.JobModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
