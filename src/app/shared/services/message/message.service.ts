import {Injectable} from '@angular/core';
import {Message} from '../../models/message/message';
import {MatSnackBar} from '@angular/material';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class MessageService {

  private _notificationSource = new Subject<Message>();

  public messagePublished$: Observable<Message> = this._notificationSource.asObservable();

  constructor(private _service: MatSnackBar) {
  }

  pushNotification(desc: string, msg: string, err: boolean = false) {
    this._notificationSource.next(new Message(msg, desc, err));
  }

  clearNotifications() {
    this._notificationSource.next(null);
  }

  private formatMessage( title: string, message: string): string {
    if ( title || message ) {
      if ( title && message ) {
        return title + ' - ' + message;
      }
      return title || message;
    }
    return '[n/a]';
  }

  pushError(title: string, message: string) {
    this.pushMessage(title, message);
  }

  pushMessage(title: string, message: string) {
    if (title || message) {
      this._service.open(this.formatMessage(title, message), 'Dismiss',{ duration: 5000 });
    }
  }
}
