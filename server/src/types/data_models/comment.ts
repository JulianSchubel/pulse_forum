import { Role } from "../role";

export interface Comment {
    id: number;
    postId: number;
    author: {
        id: number;
        role: Role;
        displayName: string;
    },
    content: string;
    createdAt: string;
}
