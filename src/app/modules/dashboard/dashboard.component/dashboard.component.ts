import {SimpleComponent} from '../../../shared/components/base.components';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from '../../../shared/services/message';
import {Router} from '@angular/router';
import {MenuService} from '../../../shared/services/menu';
import {DefaultJob, ProcessResult} from "../../../shared/models/job/job";
import {UserService} from "../../../shared/services/user";
import {ProcessResultService} from "../../../shared/services/processresult";
import {DashBoardSubmenu} from "../model/dashboardsubmenu";

@Component({
  selector: 'ro-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashBoardComponent extends SimpleComponent implements OnInit, OnDestroy {

  public items: ProcessResult[] = [];

  constructor(private _menuService: MenuService,
              private _router: Router,
              private _processResultService: ProcessResultService,
              messageService?: MessageService,
              userService?: UserService) {
    super(messageService, userService);
  }

  ngOnInit() {
    super.ngOnInit();
    //this._menuService.announceSubMenu(new DashBoardSubmenu(this._router).generate());
    this.state = this.ComponentState.Loading;
    this._processResultService.getRecent(25).subscribe(
      objs => {
        this.items = objs.map(item => {
          if (item.job) {
            item.job = new DefaultJob(item.job);
          }
          return item;
        });
      },
      err => {
        const msg = err.message || err.status || 'N/A';
        const line = err.lineNumber || 'N/A';
        this.log(JSON.stringify(err));
        this.applyError(msg + ' Line: ' + line);
        this.state=this.ComponentState.Error
      },
      () => this.state = this.ComponentState.Ready
    );

  }



  ngOnDestroy(): void {
    // if (this.updateSubscription) {
    //   this.updateSubscription.unsubscribe();
    // }
  }

  public initMenu(): void {
    this._menuService.announceSubMenu(new DashBoardSubmenu(this._router, u => u !== null).generate());
  }
}
