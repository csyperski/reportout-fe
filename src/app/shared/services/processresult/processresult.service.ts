import {Injectable} from '@angular/core';

import {BaseService} from '../baseservice';
import {AppSettings} from "../../models/appsettings/appsettings";
import {HttpClient} from "@angular/common/http";
import {ProcessResult} from "../../models/job/job";
import {Observable} from "rxjs";
import {ConfigService} from "../config";


@Injectable()
export class ProcessResultService extends BaseService<ProcessResult> {

  constructor(http: HttpClient, private _configService: ConfigService) {
    super(http);
  }

  getBaseUrl(): string {
    return this._configService.getApiUrl() + '/api/1/results';
  }

  getRecent(count: number): Observable<ProcessResult[]> {
    return this._http.get<ProcessResult[]>(this.getBaseUrl() + '/recent/' + count,
      {headers: this._headers});
  }

  getLastMonth(): Observable<ProcessResult[]> {
    return this._http.get<ProcessResult[]>(this.getBaseUrl() + '/lastmonth',
      {headers: this._headers});
  }
}
