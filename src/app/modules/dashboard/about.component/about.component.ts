import {Component, OnInit} from "@angular/core";
import { SimpleComponent} from "../../../shared/components/base.components";
import {Router} from "@angular/router";
import {MenuService} from "../../../shared/services/menu";
import {MessageService} from "../../../shared/services/message";
import {DashBoardSubmenu} from "../model/dashboardsubmenu";
import {LoginService} from "../../../shared/services/login";
import {Observable} from "rxjs";
import {AppSettings} from "../../../shared/models/appsettings/appsettings";
import {map} from "rxjs/operators";

@Component({
  selector: 'ro-about',
  styleUrls: ['./about.component.scss'],
  templateUrl: './about.component.html',

})
export class AboutComponent extends SimpleComponent implements OnInit {

  public backEnd: Observable<string>;

  constructor(private _router: Router,
              private _menuService: MenuService,
              messageService: MessageService,
              private _loginService: LoginService,) {
    super(messageService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.backEnd = this._loginService.getBackEndVersion().pipe( map( v => v['version'] ));
  }

  getVersion(): string {
    return AppSettings.version;
  }

  public initMenu(): void {
    this._menuService.announceSubMenu(new DashBoardSubmenu(this._router, u => u !== null).generate());
  }
}
