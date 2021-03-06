
export class AppSettings {

    public static get dayMap(): { [key: number]: string; } {
        return {
            1: 'Sunday',
            2: 'Monday',
            3: 'Tuesday',
            4: 'Wednesday',
            5: 'Thursday',
            6: 'Friday',
            7: 'Saturday'
        };
    }

    public static get version(): string {
        return "1.1.3";
    }

    public static get production(): boolean {
        return true;
    }

    public static get localSettingsTokenId(): string {
        return 'id_token';
    }

    public static get localSettingsTokenIdUserId(): string {
        return 'id_user';
    }

}
