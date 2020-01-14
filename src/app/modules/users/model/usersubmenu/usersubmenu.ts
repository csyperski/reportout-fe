import {Router} from '@angular/router';
import {User} from "../../../../shared/models/user/user";
import {MenuItem} from "../../../../shared/models/menuitem/menuitem";

export class UserSubmenu {

  constructor(private _router: Router,
              private _userCheck: (u: User) => boolean,
              private _adminCheck: (u: User) => boolean) {
  }

  public generate(): MenuItem[] {
    const menu: MenuItem[] = [
      new MenuItem('home', 'Dashboard', () => this._router.navigate(['/dashboard']), u => true),
      new MenuItem('perm_identity', 'List Users', () => this._router.navigate(['/users']), this._adminCheck)
      //new MenuItem('fa-power-off', 'Log Out', () => this._router.navigate(['/login']) , u => true)
    ];
    return menu;
  }
}
