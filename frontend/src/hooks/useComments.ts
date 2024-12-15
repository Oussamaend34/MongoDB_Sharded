import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

export function useComments(postId: string | null | undefined) {
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!postId) return [];

    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getPostComments(postId);
      setComments(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const deleteComment = useCallback(async (commentId: string) => {
    if (!postId) return false;
    
    try {
      await api.deleteComment(commentId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
      return false;
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    isLoading,
    error,
    fetchComments,
    refreshComments: fetchComments,
    setComments,
    deleteComment
  };
}
