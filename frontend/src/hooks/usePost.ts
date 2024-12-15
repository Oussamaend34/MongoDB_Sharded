import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { Post } from '../types/post';

export function usePost(postId: string | null | undefined) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    if (!postId) return null;

    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getPost(postId);
      setPost(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch post');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const refreshPost = useCallback(async () => {
    return fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return {
    post,
    setPost,
    isLoading,
    error,
    fetchPost,
    refreshPost
  };
}
