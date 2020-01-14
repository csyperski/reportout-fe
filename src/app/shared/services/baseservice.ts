import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DomainObject} from "../models/domainobject";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

export abstract class Service {

  protected _headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  protected _options: Object = {headers: this._headers};

  constructor(protected _http: HttpClient) {
  }
}

export abstract class BaseService<T extends DomainObject> extends Service {

  constructor(http: HttpClient) {
    super(http);
  }

  add(item: T): Observable<T> {
    return this._http.post<T>(this.getAddUrl(), item, this._options);
  }

  update(item: T): Observable<T> {
    return this._http.put<T>(this.getUpdateUrl(item.id), item, this._options);
  }

  get(id: number): Observable<T> {
    return this._http.get<T>(this.getSingleItemUrl(id), this._options);
  }

  delete(id: number): Observable<boolean> {
    return this._http.delete(this.getDeleteUrl(id), this._options).pipe(map(text => true));

  }

  list(): Observable<T[]> {
    return this._http.get<T[]>(this.getListUrl(), this._options);
  }

  abstract getBaseUrl(): string;

  getAddUrl(): string {
    return this.getBaseUrl() + '/';
  }

  getListUrl(): string {
    return this.getBaseUrl() + '/all';
  }

  getSingleItemUrl(id: number): string {
    return this.getBaseUrl() + '/' + id;
  }

  getDeleteUrl(id: number): string {
    return this.getBaseUrl() + '/' + id;
  }

  getUpdateUrl(id: number): string {
    return this.getBaseUrl() + '/';
  }

  getSearchUrl(search: string): string {
    return this.getBaseUrl() + '/search/' + search;
  }
}
