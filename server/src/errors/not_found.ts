import { StatusCodes } from "http-status-codes";
import { SystemError } from "./system";

export class NotFoundError extends SystemError {
    constructor(message: string, details: any) {
        super(message, {...details, statusCode: StatusCodes.NOT_FOUND});
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
