import {Injectable} from '@angular/core';

import { BaseService } from '../baseservice';
import {User} from "../../models/user/user";
import {AppSettings} from "../../models/appsettings/appsettings";
import {HttpClient} from "@angular/common/http";
import {AuthHelper} from "../authhelper";
import {ConfigService} from "../config";

export function isLoggedIn(): boolean {
  try {
    const existingToken: string = localStorage.getItem(AppSettings.localSettingsTokenId);
    if (existingToken && ! new AuthHelper().isTokenExpired(existingToken)) {
      const userJson: string = localStorage.getItem(AppSettings.localSettingsTokenIdUserId);
      if (userJson) {
        const user: User = <User>JSON.parse(userJson);
        return (user && user.enabled);
      }
    }
  } catch (err) {
    console.warn(`Error checking if user is already logged: ${err.message}.`);
  }
  return false;
}

export function isAdminUser(): boolean {
  if (isLoggedIn()) {
    const userJson: string = localStorage.getItem(AppSettings.localSettingsTokenIdUserId);
    if (userJson) {
      const user: User = <User>JSON.parse(userJson);
      return user.administrator;
    }
  }
  return false;
}

@Injectable()
export class UserService extends BaseService<User> {
    constructor(http: HttpClient, private _configService: ConfigService) {
        super(http);
    }

    getBaseUrl(): string {
      return this._configService.getApiUrl() + '/api/1/user';
    }
}
