import React, { useState, useRef, useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    Collapse,
    TextField,
    IconButton,
    Box,
} from "@mui/material";
import { ChatBubbleOutline, Flag, FlagOutlined, Send, ThumbsUpDownOutlined } from "@mui/icons-material";
import { PostFlaggedResponse, PostLikesResponse, PostsService } from "@src/api/services/posts";
import { useAuth } from "@src/hooks/auth";
import { Post, Comment } from "@src/types";
import { useForumSocket } from "@src/hooks/web_socket";

type ForumPostProps = {
    post: Post;
    canFlag: boolean;
};

export const ForumPostCard: React.FC<ForumPostProps> = ({ post, canFlag }) => {
    const {authenticated, user} = useAuth();
    const [expanded, setExpanded] = useState(false);
    const [newComment, setNewComment] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [comments, setComments] = useState(post.comments ?? []);
    const [likes, setLikes] = useState(post.likes);
    const [flagged, setFlagged] = useState(post.flagged);
    const [isLiking, setIsLiking] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const isOwnPost = user?.id === post.author.id;

    /**
     * Flag handling
     * */
    const handleFlag = async () => {
        if(canFlag) {
            await PostsService.flagPost(post.id, "Misleading")
//            if(result.ok) {
//                setFlagged( (prev: boolean) => !prev);
//            }
        }
    }
    /** 
     * Like handling
     * ∙ Users cannot like their own posts
     */
    const handleLike = async () => {
        if (isOwnPost || !authenticated || isLiking) {
            return;
        }
        setIsLiking(true);

        await PostsService.likePost(post.id);
//        if (result.ok) {
//            setLikes(result.value);
//        }
        setIsLiking(false);
    };

    /** 
     * Comment handling
     * ∙ Refreshes posts
     */
    const handleAddComment = async () => {
        if (!newComment.trim()) {
            return;
        }
        setIsSubmitting(true);
        const result = await PostsService.comment(post.id, newComment.trim());
        if (result.ok) {
            setNewComment("");
//            const refreshed = await PostsService.getComments(post.id);
//            if (refreshed.ok) {
//                setComments(refreshed.value);
//            }
        }
        setIsSubmitting(false);
    };
    const handleToggleComments = () => {
        setExpanded((prev) => !prev);
    };

    /* Autofocus and scroll when expanded */
    useEffect(() => {
        if (expanded && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [expanded]);
    useForumSocket({
        onCommentCreated: (comment: Comment) => {
            if(post.id === comment.postId) {
                post.commentsCount += 1;
                setComments((prev) => [comment, ...prev]);
            }
        },
        onPostLiked: (like: PostLikesResponse) => {
            if(post.id === like.postId) {
                setLikes(like.likes);
            }
            
        },
        onPostFlagged: (flagged: PostFlaggedResponse) => {
            if(post.id === flagged.postId) {
                setFlagged((prev) => !prev);
            }
        }
    });

    return (
        <Card
            className={`w-full transition-all duration-200 ${ 
                flagged 
                ? "border-2 border-red-500 bg-red-50 dark:bg-red-950" 
                : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            }`}
        >
            <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                    {post.author.displayName}
                </Typography>
                <Typography variant="body1" sx={{ my: 1 }}>
                    {post.content}
                </Typography>

                {/* Actions */}
                <Box className="flex align-center gap-1">
                    <IconButton size="small" onClick={handleLike}>
                        <ThumbsUpDownOutlined fontSize="small" />
                        {likes}
                    </IconButton>
                    <IconButton size="small" onClick={handleToggleComments}>
                        <ChatBubbleOutline fontSize="small" />
                        {post.commentsCount}
                    </IconButton>
                    <IconButton size="small" onClick={handleFlag}>
                        {flagged
                            ? <Flag fontSize="small" />
                            : <FlagOutlined fontSize="small" />
                        }
                    </IconButton>
                </Box>

                {/* Comments */}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Box mt={2}>
                        {comments?.length ? (
                            comments.map((comment: Comment) => (
                                <Box
                                    key={comment.id}
                                    className="p-2 rounded-md mb-2 borded"
                                >
                                    <Typography variant="body2">
                                        <strong>{comment.author.displayName}:</strong> {comment.content}
                                    </Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No comments yet.
                            </Typography>
                        )}

                        {/* Comment Input */}
                        {authenticated && <Box display="flex" alignItems="center" mt={2} gap={1}>
                            <TextField
                                inputRef={inputRef}
                                fullWidth
                                size="small"
                                variant="outlined"
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        if (!isSubmitting && newComment.trim()) {
                                            handleAddComment();
                                        }
                                    }
                                }}
                                disabled={isSubmitting}
                            />
                            <IconButton
                                color="primary"
                                onClick={handleAddComment}
                                disabled={isSubmitting || !newComment}
                            >
                                <Send fontSize="small" />
                            </IconButton>
                        </Box>
                        }
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    );
};
