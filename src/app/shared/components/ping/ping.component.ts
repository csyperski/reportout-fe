import {Component, OnInit, OnDestroy} from '@angular/core';
import {LoginService} from "../../services/login";
import {Subscription} from "rxjs";
import {SimpleComponent} from "../base.components";
import {MessageService} from "../../services/message";

@Component({
    selector: 'ro-ping',
    styleUrls: [ './ping.css'],
    templateUrl: './ping.html',
    providers: [
        LoginService
    ]
})
export class PingComponent extends SimpleComponent implements OnInit, OnDestroy  {

    private _subscription: Subscription;

    public success = true;

    constructor(private _loginService: LoginService,
                messageService: MessageService) {
        super(messageService);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this._subscription = this._loginService.pings$.subscribe(
            b => this.success = b,
            () => this.success = false
        );
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }
}
