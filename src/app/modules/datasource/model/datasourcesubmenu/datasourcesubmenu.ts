import {Router} from '@angular/router';
import {User} from "../../../../shared/models/user/user";
import {MenuItem} from "../../../../shared/models/menuitem/menuitem";

export class DataSourceSubmenu {

  constructor(private _router: Router,
              private _userCheck: (u: User) => boolean,
              private _adminCheck: (u: User) => boolean) {
  }

  public generate(): MenuItem[] {
    const menu: MenuItem[] = [
      new MenuItem('home', 'Dashboard', () => this._router.navigate(['/dashboard']), u => true),
      new MenuItem('category', 'List Data Sources', () => this._router.navigate(['/datasources']), this._adminCheck)
    ];
    return menu;
  }
}
