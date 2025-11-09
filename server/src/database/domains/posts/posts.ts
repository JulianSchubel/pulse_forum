import { DatabaseTypes } from "@/database/types";
import { DatabaseConnection } from "@/database/connection";
import { Flag, Like, Post, Result } from "@/types";

export interface PostsDomainInterface {
    readMany(offset: number, limit: number): Promise<Result<Post[], Error>>;
    create(authorId: number, content: string): Promise<Result<Post, Error>>;
    toggleLike(postId: number, userId: number): Promise<Result<Like, Error>>;
    toggleFlag(postId: number, moderatorId: number, reason: string): Promise<Result<Flag, Error>>;
}

export class PostsDatabaseDomain extends DatabaseConnection implements PostsDomainInterface {
    async readMany(offset: number, limit: number) {
        return this.callProcedure<Post[]>(DatabaseTypes.DatabaseFunction.POSTS_READ_MANY, [offset, limit]);
    }

    async create(authorId: number, content: string) {
        return this.callProcedure<Post>(DatabaseTypes.DatabaseFunction.POSTS_CREATE, [authorId, content]);
    }

    async toggleLike(postId: number, userId: number) {
        return this.callProcedure<Like>(DatabaseTypes.DatabaseFunction.POSTS_TOGGLE_LIKE, [postId, userId]);
    }

    async toggleFlag(postId: number, moderatorId: number, reason: string) {
        return this.callProcedure<Flag>(DatabaseTypes.DatabaseFunction.POSTS_TOGGL_FLAG, [postId, moderatorId, reason]);
    }

}
