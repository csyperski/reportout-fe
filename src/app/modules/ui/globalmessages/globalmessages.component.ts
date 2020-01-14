import { Component, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { Subscription } from 'rxjs';
import {MessageService} from '../../../shared/services/message';
import {Message} from "../../../shared/models/message/message";


@Component({
  selector: 'ro-globalmessages',
  templateUrl: './globalmessages.component.html',
  styleUrls: ['./globalmessages.component.css']
})
export class GlobalMessagesComponent implements OnInit, OnDestroy {

  public message: Message;

  private _subscription: Subscription;

  constructor(private _messageService: MessageService,
              private _changeDetectorRef: ChangeDetectorRef) {}

  hasMessage(): boolean {
    return this.message != null;
  }

  ngOnInit() {
    this._subscription = this._messageService.messagePublished$.subscribe(
      msg => {
        this.message = msg;
        this._changeDetectorRef.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

}
