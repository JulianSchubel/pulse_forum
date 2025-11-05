import { DatabaseConnection } from "@/database/connection";
import { DatabaseTypes } from "@/database/types";
import { Result } from "@/types";
import { DatabaseFunctions } from "@/types/database_functions";

export interface CommentsDomainInterface {
    create(postId: number, authorId: number, content: string): Promise<Result<DatabaseTypes.Posts.CreateOutput, Error>>;
}

export class CommentsDatabaseDomain extends DatabaseConnection implements CommentsDomainInterface {
    async create( postId: number, authorId: number, content: string) {
        return this.callProcedure<DatabaseTypes.Posts.CreateOutput>(DatabaseFunctions.COMMENTS_CREATE, [postId, authorId, content]);
    }

    async readMany(postId: number) {
        return this.callProcedure<DatabaseTypes.Posts.CreateOutput>(DatabaseFunctions.COMMENTS_READ_MANY, [postId]);
    }
}
