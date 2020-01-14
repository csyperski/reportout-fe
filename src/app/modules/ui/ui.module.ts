import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SideBarComponent} from './sidebar';
import {GlobalMessagesComponent} from './globalmessages';
import {ErrorMessageComponent} from './errormessage/errormessage.component';
import {LostComponent} from './lost';
import {LoadingComponent} from './loading';
import {NadaComponent} from './nada';
import {PasswordMessageComponent} from './passwordmessage';
import {PasswordValidatorDirective} from '../../shared/directives/password/password.directive';
import {Truncate} from './pipes/truncate';
import {YesNoPipe} from './pipes/yesno';
import {DeniedComponent} from './denied';
import {FileSizePipe} from './pipes/filesize';
import {NavigationComponent} from "./navigation/navigation.component";
import {HeaderComponent} from "./header/header.component";
import {ChartModule} from "primeng/chart";
import {ReportOutMaterialModule} from "../material/material.module";
import {DateDiffPipe} from "./pipes/datediff";
import {ErrorComponent} from "./error";

const components = [
  SideBarComponent,
  GlobalMessagesComponent,
  ErrorMessageComponent,
  LostComponent,
  LoadingComponent,
  NadaComponent,
  PasswordMessageComponent,
  DeniedComponent,
  HeaderComponent,
  PasswordValidatorDirective,
  NavigationComponent,
  ErrorComponent,
  Truncate,
  YesNoPipe,
  FileSizePipe,
  DateDiffPipe
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChartModule,
    ReportOutMaterialModule
  ],
  exports: components,
  providers: []
})
export class UiModule {
}
