import {Injectable} from '@angular/core';

import { BaseService } from '../baseservice';
import {AppSettings} from "../../models/appsettings/appsettings";
import {HttpClient} from "@angular/common/http";
import {DataSource} from "../../models/datasource/datasource";
import {Observable} from "rxjs";


@Injectable()
export class DataSourceService extends BaseService<DataSource> {

    constructor(http: HttpClient) {
        super(http);
    }

    getBaseUrl(): string {
      return AppSettings.apiUrl + '/api/1/ds';
    }

  execute(id: number): Observable<boolean> {
    return this._http.post<boolean>(this.getBaseUrl() + '/test/' + id,
      "{}",
      { headers: this._headers });
  }
}
