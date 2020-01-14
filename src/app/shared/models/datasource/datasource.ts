export class DataSource {
    id: number;
    version: number;
    name: string;
    driverClass: string;
    connectionString: string
    userName: string;
    password: string;
    testQuery: string;
    limitToAdmin: boolean;
}
