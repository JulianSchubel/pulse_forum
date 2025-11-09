import { Role } from "@/types/role";

export namespace DatabaseTypes {
    /**
     * Enum listing all stored procedure names in the database, grouped by domain.
     *
     * Each constant corresponds to the exact stored procedure name in MySQL.
     */
    export enum DatabaseFunction {
    /**
     * AUTH DOMAIN
     */
        AUTH_LOGIN = "sp_auth_login",
        AUTH_LOGOUT = "sp_auth_logout",

    /** 
     * POSTS DOMAIN
     */
        POSTS_READ_MANY = "sp_posts_read_many",
        POSTS_READ_ONE = "sp_posts_read",
        POSTS_CREATE = "sp_posts_create",
        POSTS_TOGGLE_LIKE = "sp_posts_toggle_like",
        POSTS_TOGGL_FLAG = "sp_posts_toggle_flag",
        POSTS_READ_STATS = "sp_posts_read_likes",

    /** 
     * COMMENTS DOMAIN
     */
        COMMENTS_READ_MANY = "sp_comments_read_many",
        COMMENTS_CREATE = "sp_comments_create",

    /** 
     * USERS DOMAIN
     */
        USERS_READ = "sp_users_read",
        USERS_READ_ALL = "sp_users_read_all",
        USERS_CREATE = "sp_users_create",

    /**
     * SESSION DOMAIN
     */
        SESSION_VALIDATE = "sp_session_validate_session",
    }

    export namespace Auth {
        export type LoginResult = {
            userId: number;
            username: string;
            role: Role;
            sessionId: string;
        }

        export type RegisterResult = {
            userId: number;
        }
    }

    export namespace Comments {
        export type AddCommentResult = {
            commentId: number;
        }
    }

    export namespace Flags {
    }

    export namespace Likes {
    }

    export namespace Posts {

        export type CreateInput = {
            userId: number;
            content: string;
        }

        export type CreateOutput = {
            postId: number;
        }

        export type LikeInput = {
            postId: number;
            userId: number;
        }

        export type FlaggedInput = {
            postId: number;
            reason?: string;
        }

    }

}
