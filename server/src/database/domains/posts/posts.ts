import { Result } from "@type/result";
import { DatabaseFunctions } from "@type/database_functions";
import { Post } from "@type/data_models/post";
import { DatabaseTypes } from "@/database/types";
import { DatabaseConnection } from "@/database/connection";

export interface PostsDomainInterface {
    readMany(offset: number, limit: number): Promise<Result<Post[], Error>>;
    create(authorId: number, content: string): Promise<Result<DatabaseTypes.Posts.CreateOutput, Error>>;
    toggleLike(postId: number, userId: number): Promise<Result<boolean, Error>>;
    toggleFlag(postId: number, moderatorId: number, reason: string): Promise<Result<boolean, Error>>;
}

export class PostsDatabaseDomain extends DatabaseConnection implements PostsDomainInterface {
    async readMany(offset: number, limit: number) {
        return this.callProcedure<Post[]>(DatabaseFunctions.POSTS_READ_MANY, [offset, limit]);
    }

    async create( authorId: number, content: string) {
        return this.callProcedure<DatabaseTypes.Posts.CreateOutput>(DatabaseFunctions.POSTS_CREATE, [authorId, content]);
    }

    async toggleLike(postId: number, userId: number) {
        return this.callProcedure<boolean>(DatabaseFunctions.POSTS_TOGGLE_LIKE, [postId, userId]);
    }

    async toggleFlag( postId: number, moderatorId: number, reason: string) {
        return this.callProcedure<boolean>(DatabaseFunctions.POSTS_TOGGL_FLAG, [postId, moderatorId, reason]);
    }

}
