import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Observable} from 'rxjs';

@Injectable()
export class SystemEventService {
  private _eventSource = new Subject<SystemEvent>();
  event$: Observable<SystemEvent> = this._eventSource.asObservable();

  pushEvent(event: string, object?: any) {
    this._eventSource.next(new SystemEvent(event, object));
  }
}

export class SystemEvent {
  key: string;
  object: any;

  constructor(key: string, object?: any) {
    this.key = key;
    this.object = object;
  }
}
