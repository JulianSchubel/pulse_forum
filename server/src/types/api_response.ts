import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Result } from "./result";
import { SystemError } from "@/errors/system";

export type ApiResponse<T> = {
    status: number;
    msg: string;
    isError: boolean;
    body: T;
}

export function resultToApiResponse(result: Result<any>): ApiResponse<any> {
    if (result.ok) {
        return {
            status: StatusCodes.OK,
            msg: "Success",
            isError: false,
            body: result.value
        }
    }

    const error = result.error;
    if (error instanceof SystemError) {
        return {
            status: error.details.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
            msg: error.message,
            isError: true,
            body: error.details
        }
    }
    if(error instanceof Error) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            msg: error.message,
            isError: true,
            body: null
        }
    }
    return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        msg: ReasonPhrases.INTERNAL_SERVER_ERROR,
        isError: true,
        body: null
    }
}

