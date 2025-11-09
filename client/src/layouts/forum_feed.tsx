import React from "react";
import { Container, Button } from "@mui/material";
import { useAuth } from "@hooks/auth";
import { ForumPostCard } from "@components/forum_post_card";
import { Post } from "@src/types";

type ForumFeedProps = {
  posts: Post[];
  onNewPost?: () => void;
}

export const ForumFeedLayout: React.FC<ForumFeedProps> = ({ posts, onNewPost }) => {
  const { user } = useAuth();

  return (
    <Container className="flex flex-col gap-4 py-6">
      {user && (
        <Button variant="contained" onClick={onNewPost}>
          New Post
        </Button>
      )}

      {posts.map((p) => (
        <ForumPostCard key={p.id} post={p} canFlag={user?.role === "moderator"} />
      ))}
    </Container>
  );
};

