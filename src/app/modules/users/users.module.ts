import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {UiModule} from '../ui/ui.module';
import {ReportOutMaterialModule} from "../material/material.module";
import {UserListComponent} from "./userlist.component/userlist.component";
import {AdminAuthGuard} from "../../shared/models/authguard";
import {UserEditComponent} from "./useredit.component";

export const routerConfig: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full'},
  { path: 'list', component: UserListComponent, canActivate: [AdminAuthGuard]},
  {path: 'add', component: UserEditComponent, canActivate: [AdminAuthGuard], data: {add: true}},
  {path: 'update/:id', component: UserEditComponent, canActivate: [AdminAuthGuard], data: {add: false}},
];

const components = [
  UserListComponent,
  UserEditComponent
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
export class UsersModule {
}
