import { Result } from "@/types";
import { 
    DatabaseTypes 
} from "@/database/types";
import { DatabaseConnection } from "@/database/connection";

interface AuthDomainInterface {
    login(username: string, passwordHash: string): Promise<Result<DatabaseTypes.Auth.LoginResult, Error>>;
    logout(sessionId: string): Promise<Result<boolean, Error>>;
}

export class AuthDatabaseDomain extends DatabaseConnection implements AuthDomainInterface {
    async login(
        username: string,
        passwordHash: string
    ): Promise<Result<DatabaseTypes.Auth.LoginResult, Error>> {
        return this.callProcedure(DatabaseTypes.DatabaseFunction.AUTH_LOGIN, [username, passwordHash]);
    }

    async logout(sessionId: string): Promise<Result<boolean, Error>> {
        return this.callProcedure(DatabaseTypes.DatabaseFunction.AUTH_LOGOUT, [sessionId]);
    }
}

