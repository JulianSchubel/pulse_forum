import { DatabaseConnection } from "@/database/connection";
import { DatabaseTypes } from "@/database/types";
import { Result, Comment } from "@/types";

export interface CommentsDomainInterface {
    create(postId: number, authorId: number, content: string): Promise<Result<Comment, Error>>;
    readMany(postId: number): Promise<Result<Comment[], Error>>;
}

export class CommentsDatabaseDomain extends DatabaseConnection implements CommentsDomainInterface {
    async create( postId: number, authorId: number, content: string) {
        return this.callProcedure<Comment>(DatabaseTypes.DatabaseFunction.COMMENTS_CREATE, [postId, authorId, content]);
    }

    async readMany(postId: number) {
        return this.callProcedure<Comment[]>(DatabaseTypes.DatabaseFunction.COMMENTS_READ_MANY, [postId]);
    }
}
