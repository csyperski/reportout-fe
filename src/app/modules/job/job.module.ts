import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {UiModule} from '../ui/ui.module';
import {ReportOutMaterialModule} from "../material/material.module";
import {UserAuthGuard} from "../../shared/models/authguard";
import {JobListComponent} from "./joblist.component/joblist.component";
import {JobEditComponent} from "./jobedit.component";
import {JobScheduleComponent} from "./jobschedule.component";

export const routerConfig: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full'},
  { path: 'list', component: JobListComponent, canActivate: [UserAuthGuard]},
  { path: 'schedule', component: JobScheduleComponent, canActivate: [UserAuthGuard]},
  {path: 'add', component: JobEditComponent, canActivate: [UserAuthGuard], data: {add: true}},
  {path: 'clone/:id', component: JobEditComponent, canActivate: [UserAuthGuard], data: {add: true}},
  {path: 'update/:id', component: JobEditComponent, canActivate: [UserAuthGuard], data: {add: false}},
];

const components = [
  JobListComponent,
  JobEditComponent,
  JobScheduleComponent
];

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ReportOutMaterialModule,
    UiModule,
    RouterModule.forChild(routerConfig)
  ],
  providers: [
  ]
})
export class JobModule {
}
