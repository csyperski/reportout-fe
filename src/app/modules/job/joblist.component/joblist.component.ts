import {Component} from "@angular/core";
import {CrudListComponent} from "../../../shared/components/base.components";
import {Router} from "@angular/router";
import {MenuService} from "../../../shared/services/menu";
import {MessageService} from "../../../shared/services/message";
import {JobSubmenu} from "../model/jobsubmenu";
import {JobService} from "../../../shared/services/job";
import {DefaultJob, Job} from "../../../shared/models/job/job";

@Component({
  selector: 'ro-job-list',
  styleUrls: ['./joblist.component.scss'],
  templateUrl: './joblist.component.html',

})
export class JobListComponent extends CrudListComponent<Job, JobService> {

  columnsToDisplay = ['id', 'name', 'method', 'dataSource', 'actions' ];

  constructor(jobService: JobService,
              private _router: Router,
              private _menuService: MenuService,
              messageService: MessageService) {
    super(messageService, jobService);
  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  protected afterLoadItems(): void {
    this.items = this.items.map( i => new DefaultJob(i));
    this.dataSource.data = this.items;
  }

  public cloneItem(id: number):void {
    this.log(`Attempting to clone job ${id}`);
    this._router.navigate(['/jobs/clone', id]);
  }

  initMenu(): void {
    this._menuService.announceSubMenu(new JobSubmenu(this._router, u => u !== null, u => u.administrator).generate());
  }
}
