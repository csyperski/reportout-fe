import {Injectable} from '@angular/core';
import {BaseService} from "../baseservice";
import {Job, PreviewResult, ProcessResult} from "../../models/job/job";
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../models/appsettings/appsettings";
import {Observable} from "rxjs";
import {ConfigService} from "../config";

@Injectable()
export class JobService extends BaseService<Job> {

  constructor(http: HttpClient, private _configService: ConfigService) {
    super(http);
  }

  getBaseUrl(): string {
    return this._configService.getApiUrl() + '/api/1/job';
  }

  public updateJobSchedules(item: Job): Observable<boolean> {
    return this._http.put<boolean>(this.getBaseUrl() + '/jobschedules', item, {headers: this._headers});
  }

  public execute(id: number, forceDownload: boolean = false): Observable<ProcessResult> {
    return this._http.post<ProcessResult>(this.getBaseUrl() + '/execute/' + id + (forceDownload ? '/download' : ''),
      "{}",
      {headers: this._headers});
  }

  public preview(job: Job): Observable<PreviewResult> {
    return this._http.post<PreviewResult>(this.getBaseUrl() + '/preview',
      job,
      {headers: this._headers});
  }
}
