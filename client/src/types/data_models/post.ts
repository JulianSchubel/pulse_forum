import { Role } from "./role";
import { Comment } from "./comment";

export type Post = {
    id: number;
    author: {
        id: 1,
        role: Role,
        displayName: string,
    }
    likes: number;
    flagged: boolean;
    content: string;
    commentsCount: number;
    comments: Comment[];
    createdAt: string;
    flaggedBy?: number | null;
    flaggedAt?: string | null;
}

