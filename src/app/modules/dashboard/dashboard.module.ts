import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {UiModule} from '../ui/ui.module';
import {DashBoardComponent} from './dashboard.component';
import {ReportOutMaterialModule} from "../material/material.module";
import {AboutComponent} from "./about.component";
import {UserAuthGuard} from "../../shared/models/authguard";
import {RecentGraphComponent} from "./recentgraph.component";
import {ChartModule} from "primeng/chart";
import {MonthGraphComponent} from "./monthgraph.component";
import {HistoryLineGraphComponent} from "./historylinegraph.component";

export const routerConfig: Routes = [
  { path: '', component: DashBoardComponent, canActivate: [UserAuthGuard] },
  { path: 'about', component: AboutComponent, canActivate: [UserAuthGuard] },
];

const components = [
  DashBoardComponent,
  AboutComponent,
  RecentGraphComponent,
  MonthGraphComponent,
  HistoryLineGraphComponent
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
    RouterModule.forChild(routerConfig),
    ChartModule
  ],
  providers: [
  ]
})
export class DashboardModule {
}
