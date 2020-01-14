export class LoginAttempt {
    constructor( public token: string, public message: string ) {
    }
    
    isSuccessful(): boolean {
        return this.token !== null;
    }
}
