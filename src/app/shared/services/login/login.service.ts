import {Injectable} from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../models/appsettings/appsettings";
import {Observable, Observer, timer} from "rxjs";
import { timeout, map } from 'rxjs/operators';
import {SystemVersion} from "../../models/systemversion/systemversion";
import {Service} from "../baseservice";
import {User} from "../../models/user/user";
import {ConfigService} from "../config";

@Injectable()
export class LoginService extends Service {

  pings$: Observable<boolean>;

  constructor(http: HttpClient, private _configService: ConfigService) {
    super(http);
    this.pings$ = new Observable<boolean>((observer: Observer<boolean>) => {
      const timer$ = timer( 15000, 15000);
      const timerSubscribe = timer$.subscribe(() => {
        this._http.get(this.pingUrl(), {...this._options, observe: 'response'}).pipe(
          timeout(8000),
          map( res => res.ok && res.body )
        ).subscribe(
          () => observer.next(true),
          () => observer.next(false)
        )
      });
      return () => timerSubscribe.unsubscribe();
    });
  }

  pingUrl(): string {
    return this._configService.getApiUrl() + '/api/1/auth/ping';
  }

  getBaseUrl(): string {
    return this._configService.getApiUrl() + '/api/1/auth';
  }

  getToken(): string {
    return localStorage.getItem(AppSettings.localSettingsTokenId);
  }

  logout() {
    localStorage.removeItem(AppSettings.localSettingsTokenId);
    localStorage.removeItem(AppSettings.localSettingsTokenIdUserId);
  }

  getBackEndVersion(): Observable<string> {
    return this._http.get<string>(this.getBaseUrl() + '/version', this._options);
  }

  getLatestVersion(): Observable<SystemVersion> {
    return this._http.get<SystemVersion>(this.getBaseUrl() + '/latest', this._options);
  }

  attemptLogin(username: string, password: string): Observable<string> {
    return this._http.post(this.getBaseUrl() +'/', JSON.stringify({"email": username, "password": password}), this._options)
      .pipe( map( res => res['token']));
  }

  getSelf(): Observable<User> {
    return this._http.get<User>(this._configService.getApiUrl() + '/api/1/user/self', this._options);
  }
}
