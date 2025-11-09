import { useEffect, useRef } from "react";
import { SocketClient } from "@src/services/socket";
import { Comment, Post } from "@src/types";

export const useForumSocket = (handlers: {
    onPostCreated?: (post: Post) => void,
    onCommentCreated?: (comment: Comment) => void,
    onPostLiked?: (like: any) => void,
    onPostFlagged?: (flag: any) => void,
}) => {
    const handlersRef = useRef(handlers);
    handlersRef.current = handlers;

    useEffect(() => {
        const socket = SocketClient.connect();

        const postHandler = (post: Post) => handlersRef.current.onPostCreated?.(post);
        const commentHandler = (comment: Comment) => handlersRef.current.onCommentCreated?.(comment);
        const likeHandler = (like: any) => handlersRef.current.onPostLiked?.(like);
        const flagHandler = (flag: any) => handlersRef.current.onPostFlagged?.(flag);

        socket.on("postCreated", postHandler);
        socket.on("commentCreated", commentHandler);
        socket.on("postLiked", likeHandler);
        socket.on("postFlagged", flagHandler);

        return () => {
            socket.off("postCreated", postHandler);
            socket.off("commentCreated", commentHandler);
            socket.off("postLiked", likeHandler);
            socket.off("postFlagged", flagHandler);
        };
    }, []);
};

