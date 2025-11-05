import { StatusCodes } from "http-status-codes";
import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
    protected statusCode = StatusCodes.BAD_REQUEST;
    constructor(public errors: ValidationError[]){
        super("Invalid request parameters!");
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
}
