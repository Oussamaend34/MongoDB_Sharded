import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

export function usePosts(initialLimit = 20) {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getPosts(initialLimit);
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  }, [initialLimit]);

  const deletePost = useCallback(async (postId: string) => {
    try {
      await api.deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post.post_id !== postId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
      return false;
    }
  }, []);

  const deleteComment = useCallback(async (commentId: string, postId: string) => {
    try {
      await api.deleteComment(commentId);
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.post_id === postId) {
            return {
              ...post,
              comments: post.comments.filter((comment: any) => comment.comment_id !== commentId)
            };
          }
          return post;
        })
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
      return false;
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    isLoading,
    error,
    refreshPosts: fetchPosts,
    deletePost,
    deleteComment
  };
}
