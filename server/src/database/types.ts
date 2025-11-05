import { Role } from "@/types/role";

export namespace DatabaseTypes {
    export namespace Audit {
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
