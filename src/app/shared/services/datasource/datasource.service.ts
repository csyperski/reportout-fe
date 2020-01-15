import {Injectable} from '@angular/core';

import { BaseService } from '../baseservice';
import {AppSettings} from "../../models/appsettings/appsettings";
import {HttpClient} from "@angular/common/http";
import {DataSource} from "../../models/datasource/datasource";
import {Observable} from "rxjs";
import {ConfigService} from "../config";


@Injectable()
export class DataSourceService extends BaseService<DataSource> {

    constructor(http: HttpClient, private _configService: ConfigService) {
        super(http);
    }

    getBaseUrl(): string {
      return this._configService.getApiUrl() + '/api/1/ds';
    }

  execute(id: number): Observable<boolean> {
    return this._http.post<boolean>(this.getBaseUrl() + '/test/' + id,
      "{}",
      { headers: this._headers });
  }
}
