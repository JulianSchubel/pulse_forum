import { Result } from "@/types";
import { DatabaseFunctions } from "@/types/database_functions";
import { DatabaseTypes } from "@/database/types";
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
        return this.callProcedure(DatabaseFunctions.AUTH_LOGIN, [username, passwordHash]);
    }

    async logout(sessionId: string): Promise<Result<boolean, Error>> {
        return this.callProcedure(DatabaseFunctions.AUTH_LOGOUT, [sessionId]);
    }
}

