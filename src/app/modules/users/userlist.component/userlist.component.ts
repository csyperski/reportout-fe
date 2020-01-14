import {Component} from "@angular/core";
import {User} from "../../../shared/models/user/user";
import {UserService} from "../../../shared/services/user";
import {CrudListComponent} from "../../../shared/components/base.components";
import {Router} from "@angular/router";
import {MenuService} from "../../../shared/services/menu";
import {MessageService} from "../../../shared/services/message";
import {UserSubmenu} from "../model/usersubmenu";

@Component({
  selector: 'ro-user-list',
  styleUrls: ['./userlist.component.scss'],
  templateUrl: './userlist.component.html',

})
export class UserListComponent extends CrudListComponent<User, UserService> {

  columnsToDisplay = ['id', 'email', 'name', 'enabled', 'administrator', 'actions'];

  constructor(userService: UserService,
              private _router: Router,
              private _menuService: MenuService,
              messageService: MessageService) {
    super(messageService, userService);
  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  initMenu(): void {
    this._menuService.announceSubMenu(new UserSubmenu(this._router, u => u !== null, u => u.administrator).generate());
  }
}
