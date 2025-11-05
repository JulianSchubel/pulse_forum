import { 
    Result, 
    Session 
} from "@/types";
import { DatabaseFunctions } from "@/types/database_functions";
import { DatabaseConnection } from "@/database/connection";

interface SessionDomainInterface {
    validate( sessionId: string): Promise<Result<Session, Error>>;
}

export class SessionDatabaseDomain extends DatabaseConnection implements SessionDomainInterface {
    async validate(sessionId: string ) {
        return await this.callProcedure<Session>(DatabaseFunctions.SESSION_VALIDATE, [sessionId]);
    }
}
