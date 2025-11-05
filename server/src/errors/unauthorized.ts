import { SystemError } from "./system";
import { StatusCodes } from "http-status-codes";

export class UnauthorizedError extends SystemError {
    constructor(message: string, details: any) {
        super(message, {...details, statusCode: StatusCodes.FORBIDDEN});
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

