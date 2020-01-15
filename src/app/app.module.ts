import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {PingComponent} from "./shared/components/ping/ping.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MenuService} from "./shared/services/menu";
import {LoginService} from "./shared/services/login";
import {SystemEventService} from "./shared/services/systemevent";
import {UserService} from "./shared/services/user";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TokenInterceptor} from "./shared/interceptors/token";
import {UiModule} from "./modules/ui/ui.module";
import {FormsModule} from "@angular/forms";
import {MessageService} from "./shared/services/message";
import {ProcessResultService} from "./shared/services/processresult";
import {AdminAuthGuard, UserAuthGuard} from "./shared/models/authguard";
import {DataSourceService} from "./shared/services/datasource";
import {JobService} from "./shared/services/job";
import {ConfigService, configurationServiceInitializerFactory} from "./shared/services/config";

@NgModule({
  declarations: [
    AppComponent,
    PingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    UiModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    SystemEventService,
    MenuService,
    LoginService,
    UserService,
    MessageService,
    UserAuthGuard,
    AdminAuthGuard,
    ProcessResultService,
    DataSourceService,
    JobService,
    ConfigService,
    { provide: APP_INITIALIZER, useFactory: configurationServiceInitializerFactory, deps: [ConfigService], multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
