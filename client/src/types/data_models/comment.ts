import { Role } from "./role";

export type Comment = {
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
