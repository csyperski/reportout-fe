import {ChangeDetectorRef, Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MenuService} from '../../../shared/services/menu';
import {MessageService} from '../../../shared/services/message';
import {CrudAddEditComponent} from '../../../shared/components/base.components';
import {DataSourceService} from "../../../shared/services/datasource";
import {DataSource} from "../../../shared/models/datasource/datasource";
import {JobSubmenu} from "../model/jobsubmenu";
import {JobService} from "../../../shared/services/job";
import {debounceTime, filter, finalize, flatMap} from 'rxjs/operators';
import {DefaultJob, Job, JobExport, PreviewResult, ProcessResult} from "../../../shared/models/job/job";
import {MatOptionSelectionChange} from "@angular/material/core";
import {JobSchedule, UIJobSchedule} from "../../../shared/models/jobschedule";


@Component({
  selector: 'ro-job-edit',
  templateUrl: './jobedit.component.html',
  styleUrls: ['./jobedit.component.scss'],
})
export class JobEditComponent extends CrudAddEditComponent<Job, JobService> {

  public previewResult: PreviewResult;

  previewRunning = false;

  public loadingMessage = "Loading...";

  public jobAction: number = 0;

  public dataSources: DataSource[] = [];

  public selectedTabIndex = 0;

  // Schedule stuffs
  private dayMap: { [key: number]: string; } = {
    1: 'Sunday',
    2: 'Monday',
    3: 'Tuesday',
    4: 'Wednesday',
    5: 'Thursday',
    6: 'Friday',
    7: 'Saturday'
  };

  public schedule: UIJobSchedule[][] = [];

  constructor(private _cdr: ChangeDetectorRef,
              private _router: Router,
              route: ActivatedRoute,
              private _menuService: MenuService,
              messageService: MessageService,
              jobService: JobService,
              private _dataSourceService: DataSourceService) {
    super(messageService, jobService, route);
  }

  protected init(): void {
    this.state = this.ComponentState.Loading;
    this.loadingMessage = `Loading Job ID: ${this._existingId}`;
    super.init();
    this._dataSourceService.list().subscribe(
      ds => this.dataSources = ds,
      e => this._handleErrorCase(e, item => `Failed to load data sources!`),
      () => this.state = this.ComponentState.Ready
    );
  }

  onCancel(): void {
    this._router.navigate(['/jobs/list']);
  }

  protected onSuccessSave(item): void {
    this._router.navigate(['/jobs/update/', item.id]);
  }

  protected onSuccessUpdate(item): void {
    this.init();
  }

  protected pushItemToFormGroup(job: Job, formGroup: FormGroup): void {
    if (job) {
      this.updateFormField('name', job.name, formGroup);
      this.updateFormField('description', job.description, formGroup);
      this.updateFormField('query', job.query, formGroup);
      this.updateFormField('publicJob', job.publicJob, formGroup);
      this.updateFormField('username', job.username, formGroup);
      this.updateFormField('password', job.password, formGroup);
      this.updateFormField('jobPath', job.jobPath, formGroup);
      this.updateFormField('jobHost', job.jobHost, formGroup);
      this.updateFormField('confirmationEmail', job.confirmationEmail, formGroup);
      this.updateFormField('includeHeaders', job.includeHeaders, formGroup);
      this.updateFormField('dataSource', job.dataSource ? job.dataSource.id : -1, formGroup);
      this.updateFormField('port', job.port, formGroup);
      this.updateFormField('jobAction', job.jobAction + '', formGroup);
      this.updateFormField('onlySendIfResults', job.onlySendIfResults, formGroup);
    }
  }

  public onActionChange(event: MatOptionSelectionChange): void {
    this.jobAction = +event.source.value;
    this._updateFormModel();
  }

  public changeListener($event): void {
    this.loadReportFile($event.target.files[0]);
  }

  private loadReportFile(file: File): void {
    if (file && file.name.toLocaleLowerCase().endsWith(".reportout")) {
      this.applyMessage(`Importing job...${file.name}`, '', false);
      let fileReader: FileReader = new FileReader();
      let self = this;
      fileReader.onloadend = (e: any) => {
        let raw: string = <string>fileReader.result;
        if (raw) {
          let rawJson: any = JSON.parse(raw);
          let importFile = new JobExport(rawJson);
          if (importFile) {
            self.updateFormField('name', importFile.name);
            self.updateFormField('query', importFile.query);
            self.updateFormField('description', importFile.description);
            self.applyMessage(`File imported.`, '', false);
          }
        }
      }
      fileReader.readAsText(file);
    } else {
      this.applyError(`Unable to process file: ${file.name}`);
    }
  }

  public isEmail(): boolean {
    return this.jobAction === 1;
  }

  public isFtp(): boolean {
    return this.jobAction === 2 || this.jobAction === 3;
  }

  public isNoOp(): boolean {
    return this.jobAction === 0;
  }

  public exportTask(): void {
    this.state = this.ComponentState.Loading;
    this.loadingMessage = `Running Job, please wait...`;
    this.applyMessage(`Attempting to export task: ${this._existingItem.name}...`, '', false);

    if (this._existingItem) {

      let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(new JobExport(this._existingItem)));

      let link = document.createElement('a');
      link.setAttribute('style', "display: none");
      link.setAttribute('download', this._existingItem.name.replace(/\W/g, '') + '.reportout');
      link.href = 'data:' + data;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
        this.applyMessage(`Export completed: ${this._existingItem.name}...`, '', false);
        this.state = this.ComponentState.Ready
      }, 100);
    } else {
      this.applyError('No items found to export');
      this.state = this.ComponentState.Ready;
    }
  }

  public executeTask(): void {
    this.state = this.ComponentState.Loading;
    this.loadingMessage = `Executing job, please wait...`;
    this.applyMessage(`Attempting to execute task: ${this._existingItem.name}...`, '', false);

    this._service.execute(this._existingId).subscribe(
      (pr: ProcessResult) => {
        if (pr) {
          if (pr.successful) {
            if (this._existingItem.jobAction === 0) {
              this.download(pr.data);
            }
            this.applyMessage(pr.message, 'Task Complete');
          } else {
            this.applyError(`Task Failed: ${pr.message}`);
          }
        } else {
          this.applyError('Task Failed!');
        }
        this.state = this.ComponentState.Ready;
      },
      // Error case
      (err) => this._handleErrorCase(err, (item: any) => 'Failed to execute task.')
    );
  }

  public downloadTask(): void {
    this.state = this.ComponentState.Loading;
    this.loadingMessage = `Executing task as download...`;
    this.applyMessage(`Attempting to execute task: ${this._existingItem.name}...`, '', false);

    this._service.execute(this._existingId, true).subscribe(
      (pr: ProcessResult) => {
        if (pr) {
          if (pr.successful) {
            this.download(pr.data);
            this.applyMessage(pr.message, 'Task Complete');
          } else {
            this.applyError(`Task Failed: ${pr.message}`);
          }
        } else {
          this.applyError('Task Failed!');
        }
        this.state = this.ComponentState.Ready;
      },
      // Error case
      (err) => this._handleErrorCase(err, (item: any) => 'Failed to execute task.')
    );
  }

  public b64toBlob(b64Data: string, contentType: string = 'application/octet-stream', sliceSize: number = 512): Blob {

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
  }

  public download(value: string): void {
    if (value && this._existingItem && this._existingItem.name) {
      let link = document.createElement('a');
      link.setAttribute('style', "display: none");
      link.setAttribute('download', this._existingItem.name.replace(/\W/g, '') + '.csv');
      link.href = window.URL.createObjectURL(this.b64toBlob(value));
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      }, 100);
    }
  }

  public preview(): void {
    this.previewRunning = true;
    const job: Job = this.buildObjectFromForm();
    if (job) {
      this._service.preview(job).subscribe(
        (pre) => this.previewResult = pre,
        (err) => this._handleErrorCase(err, (item: any) => 'Failed to execute task.'),
        () => this.previewRunning = false
      );
    }
  }

  private _updateFormModel(): void {
    const optionals: string[] = ['jobPath', 'jobHost', 'password', 'username', 'port'];

    optionals.forEach(s => {
      this.formModel.controls[s].validator = Validators.nullValidator;
      this.formModel.get(s).disable();
    });

    switch (this.jobAction) {
      case 0:
        break;
      case 1: // email
        ['username'].forEach(f => {
          this.formModel.controls[f].validator = Validators.required;
          this.formModel.get(f).enable();
        });
        break;
      case 2: // ftp
      case 3: // sftp
        ['username', 'password', 'jobHost', 'jobPath', 'port'].forEach(f => {
          this.formModel.controls[f].validator = Validators.required;
          this.formModel.get(f).enable();
        });
        this.formModel.controls['password'].validator = Validators.nullValidator;
        this.formModel.controls['port'].validator = Validators.nullValidator;
        break;
    }
    this._cdr.detectChanges();
  }

  protected _populateScheduleItems(): void {
    if (this._existingItem) {
      this.log(`Current items: ${this._existingItem.jobSchedules.length}`);
      for (let i = 0; i < 7; i++) {
        let day: UIJobSchedule[] = [];
        for (let z = 0; z < 24; z++) {
          let js: UIJobSchedule = new UIJobSchedule(<JobSchedule>{id: null, version: null, hour: z, dow: i + 1})
          js.selected = this._existingItem.isScheduledAt(js.dow, js.hour);
          day.push(js);
        }
        this.schedule[i] = day;
      }
    }
  }

  public collectSchedule(): void {
    if (this._existingItem) {
      let mergedSchedule: UIJobSchedule[] = [].concat.apply([], this.schedule);
      let finalItems: JobSchedule[] = mergedSchedule.filter(js => js.selected);
      this._existingItem.jobSchedules = finalItems;
    }
  }

  onSubmit(failureHandler: () => void = () => {
  }): void {
    this.applyMessage('Attempting to commit changes...', '', false);
    if (this.formModel.valid) {

      const item: Job = this.buildObjectFromForm();
      if (item != null) {
        if (this.canModify(item)) {
          try {
            if (this.validate(item)) {
              if (this.isAddOperation) {
                // Add
                this.state = this.ComponentState.Loading;
                this.loadingMessage = `Adding new item...`;
                this.applyMessage(`Attempting to add item...${this.toString(item)}`, '', false);
                this._service.add(item)
                  .pipe(finalize(() => {
                    if (this.state !== this.ComponentState.Error) {
                      this.state = this.ComponentState.Ready;
                    }
                  }))
                  .subscribe(
                    // Success case
                    (newItem: Job) => {
                      this._existingId = newItem.id;
                      this.applyMessage(this.saveSuccessMessage(newItem.id), 'Save Successful');
                      this.onSuccessSave(newItem);
                    },
                    // Error case
                    (err) => {
                      this._handleErrorCase(err, this.saveFailureMessage);
                      failureHandler();
                    }
                  );
              } else {
                // Update
                this.state = this.ComponentState.Loading;
                this.loadingMessage = `Updating item....`;
                this.applyMessage(`Attempting to update item...${this.toString(item)}`, '', false);
                this._service.update(item)
                  .pipe(
                    flatMap(item => {
                      item.jobSchedules = this._existingItem.jobSchedules;
                      return this._service.updateJobSchedules(item);
                    }),
                    finalize(() => {
                      if (this.state !== this.ComponentState.Error) {
                        this.state = this.ComponentState.Ready;
                      }
                    }))
                  .subscribe(
                    // Success case
                    updatedItem => {
                      this.applyMessage(this.saveSuccessMessage(item.id), 'Update Successful');
                      this.onSuccessUpdate(updatedItem);
                    },
                    // Error case
                    (err) => {
                      failureHandler();
                      this._handleErrorCase(err, this.saveFailureMessage);
                    }
                  );
              }
            } else {
              this.applyError('Validation failed!');
            }
          } catch (e) {
            if (e instanceof Error) {
              const error: Error = <Error>e;
              this.applyError(`Validation Error: ${error.message}`);
            } else {
              throw e;
            }
          }
        } else {
          this.applyError('You are not permitted to modify this item!');
        }
      } else {
        this.applyError('Unable to save, item is null!');
      }
    }
  }

  public getDayByNumber(id: number): string {
    return this.dayMap[id];
  }

  public getHoursOfDay(): number[] {
    return Array.from(Array(24).keys());
  }

  protected buildFormModel(): void {
    this.state = this.ComponentState.Loading;
    const fb = new FormBuilder();

    this.formModel = fb.group({
      'name': ['', Validators.compose([Validators.required])],
      'description': [''],
      'query': [''],
      'publicJob': [false],
      'username': [''],
      'password': [''],
      'jobHost': [''],
      'jobPath': [''],
      'confirmationEmail': [this.getUser().email],
      'includeHeaders': [false],
      'onlySendIfResults': [false],
      'dataSource': [''],
      'port': ['-1'],
      'jobAction': ['0']
    });

    // here we need to hook into the query field to preview data
    this.formModel.get('query').valueChanges.pipe(debounceTime(1000), filter(v => v && (<string>v).length > 5)).subscribe(
      val => this.preview(),
      error => this.log(`Error in preview: ${error}`)
    );

    if (!this.isAddOperation) {
      this.log(`Loading item: ${this._existingId}`);
      this._service.get(this._existingId).subscribe(
        // Success case
        (job: Job) => {

          const wrappedJob = new DefaultJob(job);

          this._existingItem = wrappedJob;
          this.jobAction = wrappedJob.jobAction;
          this._populateScheduleItems();
          this.pushItemToFormGroup(wrappedJob, this.formModel);
          this._updateFormModel();
          this.state = this.ComponentState.Ready;
        },
        // Error case
        (err) => {
          const msg: string = err.error || err || 'Unknown error!';
          this.applyError(`Unable to retrieve job: ${msg}`);
          this.state = this.ComponentState.Error;
        }
      );
    } else {
      if (this._existingId) {
        this.log(`Loading item for clone: ${this._existingId}`);
        this._service.get(this._existingId).subscribe(
          // Success case
          (job: Job) => {
            this.jobAction = job.jobAction;
            this._existingItem = job;
            this.pushItemToFormGroup(job, this.formModel);
            this.updateFormField('name', job.name + ' [Copy]', this.formModel);
            this.updateFormField('description', job.description + ` (copied from job ID: ${job.id})`, this.formModel);
            this._updateFormModel();
            this.state = this.ComponentState.Ready;
          },
          // Error case
          (err) => {
            const msg: string = err.error || err || 'Unknown error!';
            this.applyError(`Unable to get job: ${msg}`);
            this.state = this.ComponentState.Error;
          }
        );
      } else {
        this.state = this.ComponentState.Ready;
      }
    }
  }

  protected buildObjectFromForm(): Job {
    if (this.formModel && this.formModel.valid) {
      const job = new DefaultJob();
      if (!this.isAddOperation) {
        job.id = this._existingItem.id;
        job.version = this._existingItem.version;
        this.collectSchedule();
      }

      const stringFieldNames: string[] = ['name', 'description', 'query', 'username', 'password', 'jobHost', 'jobPath', 'confirmationEmail'];
      stringFieldNames.forEach(k => job[k] = this.getValueFromForm(k));

      // boolean
      job.publicJob = this.formModel.value['publicJob'];
      job.includeHeaders = this.formModel.value['includeHeaders'];
      job.onlySendIfResults = this.formModel.value['onlySendIfResults'];

      let dsId: number = +this.formModel.value['dataSource'];
      job.dataSource = this.dataSources.filter(ds => ds.id === dsId)[0];

      job.jobAction = +this.formModel.value['jobAction'];


      let uid: number = -1;
      if (this._existingItem && this._existingItem.creatorId > 0) {
        uid = this._existingItem.creatorId;
        this.log(`Restore existing user id of ${uid}`);
      } else {
        uid = this.getUser().id;
        this.log(`No existing user id, using ${uid}`);
      }

      job.creatorId = uid;
      job.port = parseInt(this.formModel.value['port']) || -1;
      job.jobAction = this.jobAction;

      return job;
    }
    return null;
  }

  protected validate(job: Job): boolean {
    return job && job.name && job.name.trim().length > 0;
  }

  public initMenu(): void {
    this._menuService.announceSubMenu(new JobSubmenu(this._router, u => u !== null, u => u.administrator).generate());
  }
}
