export class SystemError extends Error {
    details: any;
    constructor(message: string, details: any) {
        super(message);
        this.details = details;
        Object.setPrototypeOf(this, SystemError.prototype);
    }
}
