import {Component} from "@angular/core";
import {CrudListComponent, SimpleComponent} from "../../../shared/components/base.components";
import {Router} from "@angular/router";
import {MenuService} from "../../../shared/services/menu";
import {MessageService} from "../../../shared/services/message";
import {JobSubmenu} from "../model/jobsubmenu";
import {JobService} from "../../../shared/services/job";
import {DaySchedule, DefaultJob, Job} from "../../../shared/models/job/job";

@Component({
  selector: 'ro-schedule',
  styleUrls: ['./jobschedule.component.scss'],
  templateUrl: './jobschedule.component.html',

})
export class JobScheduleComponent extends SimpleComponent {

  public daySchedules: DaySchedule[] = [];

  constructor(
              private _router: Router,
              private _menuService: MenuService,
              messageService: MessageService,
              private _jobService: JobService) {
    super(messageService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadItems();
  }

  private getJobsAtTime(jobs: Job[], dow: number, hour: number ): Job[] {
    if ( jobs ) {
      return jobs.filter(j => {
        let job: DefaultJob = new DefaultJob(j);
        return job.isScheduledAt(dow, hour) &&
          job.jobAction > 0;

      });
    }
    return [];
  }

  protected loadItems(): void {
    this.state = this.ComponentState.Loading;
    this.daySchedules = [];
    this._jobService.list().subscribe(
      objs => {
        const items: Array<Job> = objs;

        const date: Date = new Date();
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        const targetDate: Date = new Date();

        targetDate.setDate(targetDate.getDate() + 7);  // 7 days in the future

        while (date.getTime() < targetDate.getTime() ) {
          date.setHours(date.getHours()+1);
          let jobs: Job[] = this.getJobsAtTime(items, date.getDay() + 1, date.getHours());
          if (jobs && jobs.length > 0) {
            let dJobs: DefaultJob[] = jobs.map( j => new DefaultJob(j));
            this.daySchedules.push(new DaySchedule(new Date(date.getTime()), dJobs));
          }
        }

        this.state = this.ComponentState.Ready;
      },
      err => {
        const msg = err.message || err.status || 'N/A';
        const line = err.lineNumber || 'N/A';
        this.log(JSON.stringify(err));
        this.applyError(msg + ' Line: ' + line);
        this.state = this.ComponentState.Error
      }
    );
  }

  initMenu(): void {
    this._menuService.announceSubMenu(new JobSubmenu(this._router, u => u !== null, u => u.administrator).generate());
  }
}
