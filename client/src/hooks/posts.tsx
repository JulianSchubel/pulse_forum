import PostsContext from "@src/context/posts";
import { useContext } from "react";

export const usePosts = () => {
    const ctx = useContext(PostsContext);
    if (!ctx) throw new Error("usePosts must be used within a PostsProvider");
    return ctx;
};
