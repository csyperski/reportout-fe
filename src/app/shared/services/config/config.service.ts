import {Injectable} from '@angular/core';
import {BaseService} from "../baseservice";
import {Job, PreviewResult, ProcessResult} from "../../models/job/job";
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../models/appsettings/appsettings";
import {Observable, of} from "rxjs";


export function configurationServiceInitializerFactory(configurationService: ConfigService): Function {
  // a lambda is required here, otherwise `this` won't work inside ConfigurationService::load
  return () => configurationService.load();
}

@Injectable()
export class ConfigService {

  private loaded = false;
  private configuration: any;


  public getConfig(key: any): any {

    if (!this.loaded) {
      throw new Error('StartupConfigService.getConfig() - service has not finished loading the config.');
    }

    return this.configuration[key];
  }

  public getApiUrl(): string {
    return this.getConfig('apiUrl');
  }

  // the return value (Promise) of this method is used as an APP_INITIALIZER,
  // so the application's initialization will not complete until the Promise resolves.
  public load(): Promise<any> {

    if (this.loaded) {
      return of(this, this.configuration).toPromise();
    } else {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `assets/config/config.json`);

        xhr.addEventListener('readystatechange', () => {
          if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            this.configuration = JSON.parse(xhr.responseText);
            console.log(`configuration fetched : ${JSON.stringify(this.configuration)}`);
            this.loaded = true;
            resolve(this.configuration);
          } else if (xhr.readyState === XMLHttpRequest.DONE) {
            reject();
          }
        });
        xhr.send(null);
      });
    }
  }
}
