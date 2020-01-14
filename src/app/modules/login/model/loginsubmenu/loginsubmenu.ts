import {Router} from '@angular/router';
import {MenuItem} from "../../../../shared/models/menuitem/menuitem";

export class LoginSubmenu {

  constructor(private _router: Router) {
  }

  public generate(): MenuItem[] {
    const menu: MenuItem[] = [
      new MenuItem('lock', 'Login', () => this._router.navigate(['/login']), u => true)
    ];
    return menu;
  }
}
