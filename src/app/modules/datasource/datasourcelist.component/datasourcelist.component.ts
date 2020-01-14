import {Component} from "@angular/core";
import {CrudListComponent} from "../../../shared/components/base.components";
import {Router} from "@angular/router";
import {MenuService} from "../../../shared/services/menu";
import {MessageService} from "../../../shared/services/message";
import {DataSourceService} from "../../../shared/services/datasource";
import {DataSource} from "../../../shared/models/datasource/datasource";
import {DataSourceSubmenu} from "../model/datasourcesubmenu";

@Component({
  selector: 'ro-ds-list',
  styleUrls: ['./datasourcelist.component.scss'],
  templateUrl: './datasourcelist.component.html',

})
export class DataSourceListComponent extends CrudListComponent<DataSource, DataSourceService> {

  columnsToDisplay = ['id', 'name', 'driver', 'actions' ];

  constructor(dataSourceService: DataSourceService,
              private _router: Router,
              private _menuService: MenuService,
              messageService: MessageService) {
    super(messageService, dataSourceService);
  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  public cloneItem(id: number):void {
    this.log(`Attempting to clone item ${id}`);
    this._router.navigate(['/datasources/clone', id]);
  }

  initMenu(): void {
    this._menuService.announceSubMenu(new DataSourceSubmenu(this._router, u => u !== null, u => u.administrator).generate());
  }
}
