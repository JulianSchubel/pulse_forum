import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Post } from "@typedefs/data_models/post";
import { ApiResponse, Result } from "@src/types";
import { AxiosResponse } from "axios";
import httpClient from "@src/api/client";
import { Comment } from "@src/types/data_models/comment";

type PostsContextType = {
    posts: Post[];
    readPosts: () => Promise<Result<Post[]>>;
    loadMore: () => Promise<void>;
    createPost: (authorId: number, content: string) => Promise<Result<Post>>;
    likePost: (postId: number) => Promise<Result<boolean>>;
    flagPost: (postId: number, reason: string) => Promise<Result<boolean>>;
    comment: (postId: number, content: string) => Promise<Result<Comment>>;
};

const PostsContext = createContext<PostsContextType | undefined>(undefined);

function PostsProvider({ children }: { children: ReactNode }) {

};

export { PostsProvider };
export default PostsContext;
