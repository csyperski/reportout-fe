import {AppSettings} from '../appsettings/appsettings';

export interface JobSchedule {
    id: number;
    version: number;
    hour: number;
    dow: number;
}

export class DefaultJobSchedule implements JobSchedule {

    id: number;
    version: number;
    hour: number;
    dow: number;

    constructor(jobSchedule?: JobSchedule) {
        if (jobSchedule != null) {
            this.id = jobSchedule.id;
            this.version = jobSchedule.version;
            this.hour = jobSchedule.hour;
            this.dow = jobSchedule.dow;
        }
    }

    getFullString(): string {
        return AppSettings.dayMap[this.dow] + ' ' + this.getTimeString();
    }

    getTimeString(): string {
        if (this.hour === 0) {
            return '12 AM';
        } else if (this.hour > 12) {
            return `${this.hour - 12} PM`;
        } else {
            return `${this.hour} AM`;
        }
    }
    
    getUniqueString(): string {
        return (this.id || 0) + '-' + this.dow + '-' + this.hour;
    }
}

export class UIJobSchedule extends DefaultJobSchedule {

    selected: boolean = false;

    constructor(jobSchedule?: JobSchedule) {
        super(jobSchedule);
    }
}