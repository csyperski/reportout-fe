import {Component, OnInit} from "@angular/core";
import {BaseComponent, SimpleComponent} from "../../../shared/components/base.components";
import {ProcessResultService} from "../../../shared/services/processresult";
import {DefaultJob} from "../../../shared/models/job/job";


@Component({
  selector: 'ro-month-graph',
  styleUrls: ['./monthgraph.component.scss'],
  templateUrl: './monthgraph.component.html',
})
export class MonthGraphComponent extends BaseComponent implements OnInit {

  public graphData: any;

  public message: string;

  constructor(private _processResultService: ProcessResultService) {
    super();
  }

  ngOnInit(): void {
    this.state = this.ComponentState.Loading;
    this._processResultService.getLastMonth().subscribe(
      objs => {
        const items = objs.map(item => {
          if (item.job) {
            item.job = new DefaultJob(item.job);
          }
          return item;
        });

        let countSuccess: number = items.filter(pr => pr.successful).length;
        let countFailures: number = items.filter(pr => !pr.successful).length;

        if (countSuccess > 0 || countFailures > 0) {
          this.graphData = {
            labels: ['Success','Failures'],
            datasets: [
              {
                data: [countSuccess, countFailures],
                backgroundColor: [
                  "#46BFBD",
                  "#F7464A"
                ],
                hoverBackgroundColor: [
                  "#5AD3D1",
                  "#FF5A5E"
                ]
              }]
          };
          this.state = this.ComponentState.Ready;
        } else {
          this.state = this.ComponentState.NotLoaded;
        }
      },
      err => {
        const msg = err.message || err.status || 'N/A';
        const line = err.lineNumber || 'N/A';
        this.log(JSON.stringify(err));
        this.message = msg;
        this.state = this.ComponentState.Error;
      }
    )
  }

}
