import { 
    Result, 
    Session 
} from "@/types";
import { DatabaseConnection } from "@/database/connection";
import { DatabaseTypes } from "@/database/types";

interface SessionDomainInterface {
    validate( sessionId: string): Promise<Result<Session, Error>>;
}

export class SessionDatabaseDomain extends DatabaseConnection implements SessionDomainInterface {
    async validate(sessionId: string ) {
        return await this.callProcedure<Session>(DatabaseTypes.DatabaseFunction.SESSION_VALIDATE, [sessionId]);
    }
}
