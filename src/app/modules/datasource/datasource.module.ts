import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {UiModule} from '../ui/ui.module';
import {ReportOutMaterialModule} from "../material/material.module";
import {AdminAuthGuard} from "../../shared/models/authguard";
import {DataSourceListComponent} from "./datasourcelist.component";
import {DataSourceEditComponent} from "./datasourceedit.component";

export const routerConfig: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full'},
  { path: 'list', component: DataSourceListComponent, canActivate: [AdminAuthGuard]},
  {path: 'add', component: DataSourceEditComponent, canActivate: [AdminAuthGuard], data: {add: true}},
  {path: 'clone/:id', component: DataSourceEditComponent, canActivate: [AdminAuthGuard], data: {add: true}},
  {path: 'update/:id', component: DataSourceEditComponent, canActivate: [AdminAuthGuard], data: {add: false}},
];

const components = [
  DataSourceListComponent,
  DataSourceEditComponent
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
export class DataSourceModule {
}
