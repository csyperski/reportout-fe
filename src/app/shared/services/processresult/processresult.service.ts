import {Injectable} from '@angular/core';

import {BaseService} from '../baseservice';
import {AppSettings} from "../../models/appsettings/appsettings";
import {HttpClient} from "@angular/common/http";
import {ProcessResult} from "../../models/job/job";
import {Observable} from "rxjs";


@Injectable()
export class ProcessResultService extends BaseService<ProcessResult> {
  constructor(http: HttpClient) {
    super(http);
  }

  getBaseUrl(): string {
    return AppSettings.apiUrl + '/api/1/results';
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
