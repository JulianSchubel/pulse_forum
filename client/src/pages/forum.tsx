import { useCallback, useEffect, useState } from "react";
import { Box, CircularProgress, IconButton, TextField, Typography } from "@mui/material";
import { ForumPostCard } from "@src/components/forum_post_card";
import { useAuth } from "@src/hooks/auth";
import { Post, Role } from "@src/types";
import { ForumNavbar } from "@src/components/navbar";
import { PostsService } from "@src/api/services/posts";
import { Send } from "@mui/icons-material";
import { useForumSocket } from "@src/hooks/web_socket";

export default function ForumPage() {
    const { user, authenticated } = useAuth();
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAddPost = async () => {
        if (!newPost.trim()) return;
        setIsSubmitting(true);
        const result = await PostsService.createPost(user?.id ?? -1, newPost.trim());
        if (result.ok) {
            setNewPost("");
            const refreshed = await PostsService.readPosts(1);
            if (refreshed.ok) {
                setPosts(refreshed.value);
            }
        }
        setIsSubmitting(false);
    };

    const handleLoadMore = () => setPage((prev) => prev + 1);

    const getPosts = useCallback(async () => {
        setLoading(true);
        const postsResult = await PostsService.readPosts(page);
        if (!postsResult.ok) {
            console.error(postsResult);
            setLoading(false);
            return;
        }
        if (page === 1) setPosts(postsResult.value);
            else setPosts((prev) => [...prev, ...postsResult.value]);
        setLoading(false);
    }, [page]);

    useEffect(() => {
        getPosts();
    }, [getPosts]);

    useForumSocket({
        onPostCreated: (post: Post) => {
            getPosts();
            console.log(post);
            setPosts((prev) => [post, ...prev]);
        }
    });
    return (
        <>
            <ForumNavbar />

                <div className="flex flex-col items-center justify-center pt-6">
                <Typography>
                    { !authenticated 
                        ? "Create an account to contribute to the forum!"
                        : `Welcome ${user?.username}!`
                    }
                </Typography>
                </div>
            {/* Main container */}
            <div className="flex flex-col items-center justify-center min-h-[calc(60vh)] pt-6 pb-24">
                {/* New Post Input (for logged-in users) */}
                {authenticated && (
                    <div className="w-full max-w-xl flex flex-col gap-4 px-4 mb-8">
                        <Box display="flex" alignItems="center" mt={2} gap={1}>
                            <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                placeholder="Share something with the forum..."
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                disabled={isSubmitting}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        if (!isSubmitting && newPost.trim()) {
                                            handleAddPost();
                                        }
                                    }
                                }}
                            />
                            <IconButton
                                color="primary"
                                onClick={handleAddPost}
                                disabled={isSubmitting || !newPost}
                            >
                                <Send fontSize="small" />
                            </IconButton>
                        </Box>
                    </div>
                )}
               {!posts.length ? (
                    <CircularProgress />
                ) : (
                    <div className="w-full max-w-xl flex flex-col gap-4 px-4">
                        {posts.map((post) => (
                            <ForumPostCard
                                key={post.id}
                                post={post}
                                canFlag={user?.role === Role.MODERATOR}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm py-3 shadow-[0_-2px_6px_rgba(0,0,0,0.15)] flex justify-center items-center z-50">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    © {new Date().getFullYear()} Pulse Forum. All rights reserved.
                </p>
            </div>
            {/* Fixed "Load More" button */}
        </>
    );
}

