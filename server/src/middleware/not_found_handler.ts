import { NotFoundError } from "@/errors";
import { Result } from "@/types";
import {Request, Response} from "express"
import { ReasonPhrases } from "http-status-codes";

export const notFoundHandler = (req: Request, res: Response) => {
    res.sendResult(Result.error(new NotFoundError(ReasonPhrases.NOT_FOUND, {})));
}

