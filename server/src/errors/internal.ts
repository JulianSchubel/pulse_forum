import { SystemError } from "./system";
import { StatusCodes } from "http-status-codes";

export class InternalError extends SystemError {
    constructor(message: string, details: any) {
        super(message, {...details, statusCode: StatusCodes.INTERNAL_SERVER_ERROR});
        Object.setPrototypeOf(this, InternalError.prototype);
    }
}
