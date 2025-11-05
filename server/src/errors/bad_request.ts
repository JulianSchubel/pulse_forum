import { SystemError } from "./system";
import { StatusCodes } from "http-status-codes";

export class BadRequestError extends SystemError {
    constructor(message: string, details: any) {
        super(message, {...details, statusCode: StatusCodes.BAD_REQUEST});
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

