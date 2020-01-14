import {DomainObject} from '../domainobject';

export class User implements DomainObject {
    id: number;
    version: number;
    email: string;
    firstName: string;
    lastName: string
    password: string;
    administrator: boolean;
    enabled: boolean;
    passwordChangeRequested: boolean;
}
