import { SystemError } from "./system";
import { StatusCodes } from "http-status-codes";

export class UnauthenticatedError extends SystemError {
    constructor(message: string, details: any) {
        super(message, {...details, statusCode: StatusCodes.UNAUTHORIZED});
        Object.setPrototypeOf(this, UnauthenticatedError.prototype);
    }
}

