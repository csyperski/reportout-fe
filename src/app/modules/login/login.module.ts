import {NgModule} from '@angular/core';
import {LoginScreenComponent} from './loginscreen.component/loginscreen.component';
import {EmailValidator, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ReportOutMaterialModule} from '../material/material.module';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {UiModule} from '../ui/ui.module';
import {EmailValidatorDirective} from '../../shared/directives/email/email.directive';

export const routerConfig: Routes = [
  { path: '', component: LoginScreenComponent },
];

const components = [
  LoginScreenComponent,
  EmailValidatorDirective
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
    LoginScreenComponent,
  ]
})
export class LoginModule {
}
