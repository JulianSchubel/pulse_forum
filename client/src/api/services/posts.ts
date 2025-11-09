import { ApiResponse, Post, Result, Comment } from "@src/types";

import httpClient from "../client";

export type PostLikesResponse = { postId: number; likes: number; };
export type PostFlaggedResponse = { postId: number; flagged: boolean; };

export class PostsService {
    public static async readPosts(pageToLoad: number = 1): Promise<Result<Post[]>> {
        try {
            const response = await httpClient.get<void, ApiResponse<Post[]>>("/api/posts", { params: { page: pageToLoad, limit: 10}});
            if(response.isError) {
                return Result.error(new Error("Failed to retrieve posts"));
            } else {
                /* returned when the offset exceeds the number of records */
                if(response.body === null) {
                    return Result.ok([]);
                }
            }
            return Result.ok(response.body);
        } catch(error: any) {
            return Result.error(new Error("An unexpected error occurred"));
        }
    };

    public static async createPost(authorId: number, content: string): Promise<Result<Post>> {
        try {
            const response = await httpClient.post<void, ApiResponse<Post>>("api/posts/", {authorId, content});
            if(response.isError) {
                return Result.error(new Error("Failed to create post"));
            } 
            return Result.ok(response.body);
        } catch {
            return Result.error(new Error("An unexpected error occurred"));
        }
    };

    public static async likePost(postId: number): Promise<Result<number>> {
        try {
            const response = await httpClient.post<void, ApiResponse<PostLikesResponse>>("/api/posts/like", {postId});
            if(response.isError) {
                return Result.error(new Error("Failed to like post"));
            }
            return Result.ok(response.body.likes);
        } catch {
            return Result.error(new Error("An unexpected error occurred"));
        }
    };

    public static async flagPost(postId: number, reason: string): Promise<Result<PostFlaggedResponse>> {
        try {
            const response = await httpClient.post<void, ApiResponse<PostFlaggedResponse>>("/api/posts/flag", {postId, reason});
            if(response.isError) {
                return Result.error(new Error("Failed to flag post"));
            }
            return Result.ok(response.body);
        } catch {
            return Result.error(new Error("An unexpected error occurred"));
        }
    };

    public static async comment(postId: number, content: string): Promise<Result<Comment>> {
        try {
            const response = await httpClient.post<void, ApiResponse<Comment>>("/api/comments", { postId, content});
            if(response.isError) {
                return Result.error(new Error("Failed to create comment"));
            }
            return Result.ok(response.body);
        } catch {
            return Result.error(new Error("An unexpected error occurred"));
        }
    };

    public static async getComments(postId: number): Promise<Result<Comment[]>> {
        try {
            const response = await httpClient.get<void, ApiResponse<Comment[]>>("/api/comments", {params: {postId}});
            if(response.isError) {
                return Result.error(new Error("Failed to retrieve comments"));
            }
            return Result.ok(response.body);
        } catch {
            return Result.error(new Error("An unexpected error occurred"));
        }
    }
}
