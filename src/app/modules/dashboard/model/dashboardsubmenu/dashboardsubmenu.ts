import {Router} from '@angular/router';
import {MenuItem} from "../../../../shared/models/menuitem/menuitem";
import {User} from "../../../../shared/models/user/user";

export class DashBoardSubmenu {

  constructor(private _router: Router, private _userCheck: (u: User) => boolean) {
  }

  public generate(): MenuItem[] {
    const menu: MenuItem[] = [
      new MenuItem('home', 'Home', () => this._router.navigate(['/dashboard']), this._userCheck),
      new MenuItem('stars', 'About', () => this._router.navigate(['/dashboard/about']), this._userCheck)
    ];
    return menu;
  }
}
