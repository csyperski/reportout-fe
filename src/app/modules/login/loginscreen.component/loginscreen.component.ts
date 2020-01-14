import {SimpleComponent} from '../../../shared/components/base.components';
import {Component, OnInit} from '@angular/core';
import {MessageService} from '../../../shared/services/message';
import {Router} from '@angular/router';
import {MenuService} from '../../../shared/services/menu';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../../../shared/services/login';
import * as decode from 'jwt-decode';
import {LoginSubmenu} from '../model/loginsubmenu';
import {SystemEventService} from '../../../shared/services/systemevent';
import {AppSettings} from "../../../shared/models/appsettings/appsettings";
import {UserService} from "../../../shared/services/user";

@Component({
  selector: 'ro-login',
  templateUrl: './loginscreen.component.html',
  styleUrls: ['./loginscreen.component.scss']
})
export class LoginScreenComponent extends SimpleComponent implements OnInit {

  public formGroup: FormGroup;

  constructor(private _menuService: MenuService,
              private _router: Router,
              private _loginService: LoginService,
              private _systemEventService: SystemEventService,
              messageService?: MessageService,
              userService?: UserService) {
    super(messageService, userService);
  }

  ngOnInit() {
    super.ngOnInit();
    this._loginService.logout();
    this._systemEventService.pushEvent('user:logout');
    const fb = new FormBuilder();
    this.formGroup = fb.group({
      'username': ['', Validators.compose([Validators.required])],
      'password': ['', Validators.required]
    });

    this._menuService.announceSubMenu(new LoginSubmenu(this._router).generate());
  }

  onSubmit(): void {
    this.applyMessage('Attempting to authenticate...', '', false);
    if (this.formGroup.valid) {
      this.log('Auth form looks valid.');

      this._loginService.attemptLogin(this.formGroup.value['username'], this.formGroup.value['password'])
        .subscribe(
          (token) => {
            const decoded = decode(token);
            const username = decoded['userEmail'];
            console.log(`Username: ${username}`);

            localStorage.setItem(AppSettings.localSettingsTokenId, token);
            this._loginService.getSelf().subscribe(
              u => {
                this.applyMessage('Login Successful!', '', true);
                this.log('Login successful for ' + username);
                localStorage.setItem(AppSettings.localSettingsTokenIdUserId, JSON.stringify(u));
                this._systemEventService.pushEvent('user:login', u);
                this._router.navigate(['/dashboard']);
              },
              e => {
                console.log(e);
                this.applyMessage('Unable to resolve user!', '', true);
              }
            );
          },
          e => {
            console.log(e);
            this.applyMessage('Login Failed!', '', true);
          }
        );
    }
  }
}
