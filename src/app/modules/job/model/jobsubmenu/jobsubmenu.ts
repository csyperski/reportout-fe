import {Router} from '@angular/router';
import {User} from "../../../../shared/models/user/user";
import {MenuItem} from "../../../../shared/models/menuitem/menuitem";

export class JobSubmenu {

  constructor(private _router: Router,
              private _userCheck: (u: User) => boolean,
              private _adminCheck: (u: User) => boolean) {
  }

  public generate(): MenuItem[] {
    const menu: MenuItem[] = [
      new MenuItem('home', 'Dashboard', () => this._router.navigate(['/dashboard']), u => true),
      new MenuItem('star', 'List Jobs', () => this._router.navigate(['/jobs']), this._userCheck),
      new MenuItem('calendar_today', 'Job Schedule', () => this._router.navigate(['/jobs/schedule']), this._userCheck)
    ];
    return menu;
  }
}
