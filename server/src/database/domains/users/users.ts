import { Result } from "@/types";
import { DatabaseTypes } from "@/database/types";
import { User } from "@/types/data_models/users";
import { DatabaseConnection } from "@/database/connection";

interface UsersDomainInterface {
    read( id?: number, username?: string): Promise<Result<User, Error>>;

    readMany(): Promise<Result<User[], Error>>;

    create(username: string, passwordHash: string): Promise<Result<User, Error>>;
}

export class UsersDatabaseDomain extends DatabaseConnection implements UsersDomainInterface {
    async read( id?: number, username?: string) {
        return await this.callProcedure<User>(DatabaseTypes.DatabaseFunction.USERS_READ, [id, username]);
    }

    async readMany() {
        return await this.callProcedure<User[]>(DatabaseTypes.DatabaseFunction.USERS_READ_ALL);
    }

    async create(username: string, passwordHash: string) {
        return await this.callProcedure<User>(DatabaseTypes.DatabaseFunction.USERS_CREATE, [username, passwordHash]);
    }
}
