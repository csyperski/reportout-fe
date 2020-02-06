import {DataSource} from '../datasource/datasource'
import {JobSchedule} from '../jobschedule/jobschedule'

export interface Job {
    id: number;
    version: number;
    port: number;
    name: string;
    description: string;
    query: string
    publicJob: boolean;
    jobAction: number;
    username: string;
    password: string;
    jobHost: string;
    jobPath: string;
    confirmationEmail: string;
    includeHeaders: boolean;
    onlySendIfResults: boolean;
    dataSource: DataSource;
    jobSchedules: JobSchedule[];
    creatorId: number;

    isScheduledAt(dow: number, hour: number): boolean;
    getJobActionString(): string
}

export class DefaultJob implements Job {

    id: number;
    version: number;
    port: number = -1;
    name: string;
    description: string;
    query: string
    publicJob: boolean;
    jobAction: number;
    username: string;
    password: string;
    jobHost: string;
    jobPath: string;
    confirmationEmail: string;
    includeHeaders: boolean;
    onlySendIfResults: boolean;
    dataSource: DataSource;
    jobSchedules: JobSchedule[];
    creatorId: number;

    constructor(job?: Job) {
        if (job) {
            this.id = job.id;
            this.version = job.version;
            this.name = job.name;
            this.description = job.description;
            this.query = job.query;
            this.publicJob = job.publicJob;
            this.jobAction = job.jobAction;
            this.username = job.username
            this.password = job.password;
            this.jobHost = job.jobHost;
            this.jobPath = job.jobPath;
            this.confirmationEmail = job.confirmationEmail;
            this.includeHeaders = job.includeHeaders;
            this.onlySendIfResults = job.onlySendIfResults;
            this.dataSource = job.dataSource;
            this.jobSchedules = job.jobSchedules;
            this.creatorId = job.creatorId;
            this.port = job.port;
        }
    }

    public isScheduledAt(dow: number, hour: number): boolean {
        return this.jobSchedules.filter(js => js.hour === hour && js.dow == dow).length > 0;
    }

    public getJobActionString(): string {
        switch ( this.jobAction ) {
            case 0:
                return 'Manual';
            case 1:
                return 'Email';
            case 2:
                return 'FTP';
            case 3:
                return 'SFTP';
            default:
                return 'N/A';
        }
    }
}

export interface ProcessResult {
    id: number;
    version: number;
    successful: boolean;
    message: string;
    data: string;
    records: number;
    dateStarted: number;
    dateCompleted: number;
    executedByScheduler: boolean;
    executedBy: number;
    jobId: number;
    job: Job;
}

export interface PreviewResult {

    successful: boolean;
    message: string;
    data: string[][];
    headerTitles: string[];
    sql: string;

}

export class JobExport {

    // job properties
    name: string;
    description: string;
    query: string;

    distributor: string;        // company / person's name
    distributorNotes: string;   // description to appear in market
    distributorWebsite: string;

    reportUuid: string;
    reportVersion: string;

    category: number = -1;
    subCategory: number = -1;

    exportDate: Date;

    constructor(job?: Job|any) {
        if ( job ) {
            this.name = job.name;
            this.description = job.description;
            this.query = job.query;
        }
        this.exportDate = new Date();
        this.reportVersion = "1.0.0";
    }

}

export class DaySchedule {

    constructor(public date: Date, public jobs: Array<Job>) {

    }

}
