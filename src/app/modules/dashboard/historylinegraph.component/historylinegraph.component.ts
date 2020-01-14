import {Component, OnInit} from "@angular/core";
import {BaseComponent, SimpleComponent} from "../../../shared/components/base.components";
import {ProcessResultService} from "../../../shared/services/processresult";
import {DefaultJob} from "../../../shared/models/job/job";


@Component({
  selector: 'ro-historyline-graph',
  styleUrls: ['./historylinegraph.component.scss'],
  templateUrl: './historylinegraph.component.html',
})
export class HistoryLineGraphComponent extends BaseComponent implements OnInit {

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

          let today: Date = new Date();
          let labels: string[] = [];
          let successes: number[] = [];
          let failures: number[] = [];
          for (let i = 29; i >= 0; i--) {
            let d: Date = new Date();
            d.setDate(d.getDate() - i);
            labels.push((d.getMonth() + 1) + "-" + d.getDate());
            successes[i] = 0;
            failures[i] = 0;
          }


          items.forEach(pr => {
            let startTime: Date = new Date(0);
            startTime.setUTCSeconds(pr.dateStarted / 1000);
            let diff: number = Math.round((today.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24));
            if (pr.successful) {
              successes[29 - diff]++;
            } else {
              failures[29 - diff]++;
            }
          });

          this.graphData = {
            labels: labels,
            datasets: [
              {
                label: 'Failures',
                data: failures,
                fill: true,
                borderColor: '#F7464A',
                backgroundColor: 'rgba(247,70,74,0.2)'
              },
              {
                label: 'Successful',
                data: successes,
                fill: true,
                borderColor: '#46BFBD',
                backgroundColor: 'rgba(70,191,189,0.2)'
              }
            ]
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
